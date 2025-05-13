// Récupère la date actuelle au format français (JJ/MM/AAAA)
const dateString = new Date().toLocaleDateString("fr-FR");
let [day, month, year] = dateString.split('/').map(Number);
let date = new Date(year, month - 1, day);

let indice_jour = date.getDay();
let offsetjour = 0;
if (indice_jour === 0) indice_jour = 7;

async function estMedecin(nom) {
    const response = await fetch('/info2/site/PHP/get-data.php?action=doctors');
    const tableauDOC = await response.json();
    return tableauDOC.some(doc => doc.nom === nom);
}

const dateInput = document.getElementById("calendrier");
dateInput.addEventListener('change', () => {
    [year, month, day] = dateInput.value.split("/").map(Number);
    if (year >= 2000 && year <= 2100) {
        console.log("Date sélectionnée:", dateInput.value);
        dateInput.value = "";
        date = new Date(year, month - 1, day);
        indice_jour = date.getDay();
        offsetjour = 0;
        maj_semaine();
    }
});

const main = document.getElementsByClassName("main_cal")[0];
const listeJour = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

creation_jour();
maj_semaine();

async function chargerEtAfficherRDV() {
    const dateDebutSemaine = new Date(date);
    dateDebutSemaine.setDate(date.getDate() + offsetjour + 1 - indice_jour);
    const dateFinSemaine = new Date(dateDebutSemaine);
    dateFinSemaine.setDate(dateDebutSemaine.getDate() + 6);

    try {
        const response = await fetch('/info2/site/PHP/get-data.php?action=rdvs');
        const tableauRDV = await response.json();

        for (const rdv of tableauRDV) {
            const nom = rdv.nom_utilisateur;
            const couleur = rdv.couleur;
            const debut = new Date(rdv.date_debut.replace(' ', 'T'));
            const fin = new Date(rdv.date_fin.replace(' ', 'T'));

            if ((debut >= dateDebutSemaine && debut <= dateFinSemaine) ||
                (fin >= dateDebutSemaine && fin <= dateFinSemaine) ||
                (debut <= dateDebutSemaine && fin >= dateFinSemaine)) {

                const jourStr = debut.toLocaleDateString("fr-FR");
                const h_debut = (debut.getHours() - 8) * 6 + Math.floor(debut.getMinutes() / 10);
                const h_fin = (fin.getHours() - 8) * 6 + Math.floor(fin.getMinutes() / 10) - 1;

                const estDoc = await estMedecin(nom);
                //const couleurRdv = estDoc ? couleur : "black";

                await create_rdv(h_debut, h_fin, jourStr, jourStr, couleurRdv, nom);
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des RDV:', error);
    }
}

function create(tag, container, text = null) {
    const element = document.createElement(tag);
    if (text) element.innerText = text;
    container.appendChild(element);
    return element;
}

function creation_jour() {
    for (let i = 0; i < 7; i++) {
        let datetemp = new Date();
        datetemp.setDate(date.getDate() + i + 1 - indice_jour);

        const div_jour = create("div", main);
        div_jour.classList.add("jour");

        const article = create("article", div_jour);
        article.classList.add("datejour");

        const date_jour = datetemp.toLocaleDateString();
        create("p", article, listeJour[i] + "\n" + date_jour);
        div_jour.id = date_jour;

        creation_crenau(i, div_jour, datetemp);

        if (i === 0) div_jour.classList.add("border_bottom_top_left");
        else if (i === 6) {
            div_jour.classList.add("border_bottom_top_right", "border_right");
        }
    }
}

function maj_semaine() {
    maj_date();
    maj_id();
    maj_rdv();
}

function maj_date() {
    const jours = document.querySelectorAll(".jour");
    jours.forEach((e, index) => {
        const datetemp = new Date(year, month - 1, day);
        datetemp.setDate(date.getDate() + index + offsetjour + 1 - indice_jour);
        const date_jour = datetemp.toLocaleDateString();
        e.id = date_jour;
        const dj = e.querySelector(".datejour > p");
        dj.innerText = listeJour[index] + "\n" + date_jour;
    });
}

function maj_id() {
    document.querySelectorAll(".jour").forEach(e => {
        e.querySelectorAll(".creneau").forEach((creneau, index) => {
            creneau.id = e.id + index;
        });
    });
}

function maj_rdv() {
    document.querySelectorAll(".rdv").forEach(e => e.remove());
    document.querySelectorAll(".custom_bg_color").forEach(e => {
        e.classList.remove("custom_bg_color", "custom_border_top", "invisible_border_top", "invisible_border_bottom");
    });
    chargerEtAfficherRDV();
}

function creation_crenau(indice_div_jour, div_jour, datetemp) {
    let heure = 8;
    for (let j = 0; j < 72; j++) {
        const article_creneau = create("article", div_jour);
        article_creneau.id = datetemp.toLocaleDateString() + j;
        article_creneau.classList.add("creneau");

        article_creneau.classList.add(Math.floor(j / 3) % 2 === 0 ? "gris_fonce" : "gris_clair");
        if (indice_div_jour === 0 && j % 6 === 0) {
            const carre_heure = create("div", article_creneau);
            carre_heure.classList.add("carre_heure");
            const texte = create("p", carre_heure, `${heure}h00`);
            texte.classList.add("heure");
            heure++;
        }

        if (j % 6 === 0) article_creneau.classList.add("border_top");
        if (j === 71) {
            if (indice_div_jour === 0) article_creneau.classList.add("article_border_bottom_left_radius");
            else if (indice_div_jour === 6) article_creneau.classList.add("article_border_bottom_right_radius");
        }

        article_creneau.addEventListener("click", () => {
            console.log("Créneau cliqué:", article_creneau.id);
        });
    }
    chargerEtAfficherRDV();
}

function calcul_duree(start, duration) {
    const total_start = 8 * 60 + start * 10;
    const total_end = total_start + duration * 10;

    const start_hour = Math.floor(total_start / 60);
    const start_min = total_start % 60;
    const end_hour = Math.floor(total_end / 60);
    const end_min = total_end % 60;

    return `${start_hour}h${start_min.toString().padStart(2, '0')} - ${end_hour}h${end_min.toString().padStart(2, '0')}`;
}

function conversion_heure_en_id(heure_debut) {
    return (parseInt(heure_debut.slice(0, 2)) - 8) * 6 + parseInt(heure_debut.slice(3, 4));
}

async function create_rdv(horaire_debut, horaire_fin, journee, journee_fin = journee, color, nom) {
    const estDoc = await estMedecin(nom);
    if (horaire_debut > -1 && horaire_fin < 72 && document.getElementById(journee)) {
        for (let i = horaire_debut; i <= horaire_fin; i++) {
            const creneau = document.getElementById(journee + i);
            creneau.style.setProperty('--border-color', color);
            creneau.classList.add("custom_bg_color");
            creneau.style.zIndex = i === horaire_debut ? 1 : 0;

            if (i === horaire_debut) {

                // pour ne pas dupliquer
                if (creneau.querySelector(".rdv")) continue;

                const box = create("article", creneau);
                box.classList.add("rdv");
                box.style.height = creneau.offsetHeight * (horaire_fin - horaire_debut + 1) - 3 + "px";

                const toggleButton = create("div", box, "Afficher les détails");
                toggleButton.classList.add("toggle_button");
                toggleButton.style.fontSize = creneau.offsetHeight < 40 ? "0.6rem" : "1rem";

                const details = create("div", box);
                details.classList.add("rdv_details");
                details.style.display = "none";

                const [day, month, year] = journee.split("/").map(Number);
                const dateObj = new Date(year, month - 1, day);

                create("p", details, `Date : ${dateObj.toLocaleDateString("fr-FR")}`);
                create("p", details, calcul_duree(horaire_debut, horaire_fin - horaire_debut + 1));

                if (estDoc) {
                    create("p", details, nom);
                    
                }

                toggleButton.addEventListener("click", () => {
                    details.style.display = details.style.display === "none" ? "block" : "none";
                });
            }
        }
    }
}




// Navigation gauche/droite entre les semaines avec animation
const boutonG = document.getElementsByClassName("selecteur_gauche")[0];
const boutonD = document.getElementsByClassName("selecteur_droit")[0];
const box = document.querySelectorAll(".jour");

// Semaine précédente
boutonG.addEventListener('click', () => {
    offsetjour -= 7;
    box.forEach(element => {
        element.classList.remove('transition_cal_g');
        element.classList.add('transition_cal_g');
        setTimeout(_ => {
            element.classList.remove('transition_cal_g');
        }, 1000);
    });
    maj_semaine();
});

// Semaine suivante
boutonD.addEventListener('click', () => {
    offsetjour += 7;
    box.forEach(element => {
        element.classList.remove('transition_cal_d');
        element.classList.add('transition_cal_d');
        setTimeout(_ => {
            element.classList.remove('transition_cal_d');
        }, 1000);
    });
    maj_semaine();
});


// vvv
function createAppointmentElement(appointment) {
    const element = document.createElement('div');
    element.className = `rdv ${appointment.couleur}`; 
    element.textContent = appointment.nom_medecin || appointment.nom_utilisateur;
    return element;
}


document.querySelectorAll('.creneau').forEach(slot => {
    if (slot.hasAppointment) { 
        const appointmentElement = createAppointmentElement(slot.appointmentData);
        slot.appendChild(appointmentElement);
    }
});
// ^^^