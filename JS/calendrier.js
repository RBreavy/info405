// Récupère la date actuelle au format français (JJ/MM/AAAA)
const dateString = new Date().toLocaleDateString("fr-FR");
let [day, month, year] = dateString.split('/').map(Number);
let date = new Date(year, month - 1, day);

let indice_jour = date.getDay();
let offsetjour = 0;
if (indice_jour === 0) indice_jour = 7;
let anciensRDV = [];



async function estMedecin(nom) {
    const response = await fetch('/info2/site/PHP/get-data.php?action=doctors');
    const tableauDOC = await response.json();
    return tableauDOC.some(doc => doc.nom === nom);
}

let estDoc = false;
estMedecin(nomUtilisateur).then(val => {
    estDoc = val;
    maj_semaine(); // lancer une fois qu'on sait si c'est un doc
});


const dateInput = document.getElementById("calendrier");
dateInput.addEventListener('change', () => {
    
    [year, month, day] = dateInput.value.split("-").map(Number);
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
    dateFinSemaine.setHours(23, 59, 59);
    

    try {

        if (estDoc) {
            var result = await fetch(`/info2/site/PHP/get-data.php?action=rdvs&id_medecin=${id}`);
            const indispt = await fetch(`/info2/site/PHP/get-data.php?action=getIT&id_medecin=${id}`);
            const tableauIT = await indispt.json();
            const indispr = await fetch(`/info2/site/PHP/get-data.php?action=getIR&id_medecin=${id}`);
            const tableauIR = await indispr.json();
            for (const IT of tableauIT) {
                const debutIndisp = new Date(IT.debut_periode.replace(' ', 'T'));
                const finIndisp = new Date(IT.fin_periode.replace(' ', 'T'));
                
                // Vérifier si l'indisponibilité est dans la semaine affichée
                if ((debutIndisp >= dateDebutSemaine && debutIndisp <= dateFinSemaine) ||
                    (finIndisp >= dateDebutSemaine && finIndisp <= dateFinSemaine) ||
                    (debutIndisp <= dateDebutSemaine && finIndisp >= dateFinSemaine)) {
                    
                    // Parcourir chaque jour de l'indisponibilité
                    let currentDate = new Date(Math.max(debutIndisp, dateDebutSemaine));
                    
                    const endDate = new Date(Math.min(finIndisp, dateFinSemaine));
                    while (currentDate <= endDate) {
                        const jourStr = currentDate.toLocaleDateString("fr-FR");
                        let h_debut = 0; // 8h00
                        let h_fin = 71;  // 19h50

                        
                        // Si c'est le premier jour de l'indisponibilité
                        if (currentDate.toDateString() === debutIndisp.toDateString()) {
                            h_debut = (debutIndisp.getHours() - 8) * 6 + Math.floor(debutIndisp.getMinutes() / 10);
                        }
                        
                        // Si c'est le dernier jour de l'indisponibilité
                        if (currentDate.toDateString() === finIndisp.toDateString()) {
                            h_fin = (finIndisp.getHours() - 8) * 6 + Math.floor(finIndisp.getMinutes() / 10) - 1;
                        }
                        
                        setTimeout(() => {
                            //document.querySelectorAll(`#${jourStr} .rdv`).forEach(el => el.remove());
                            create_rdv(h_debut, h_fin, jourStr, jourStr, "lightgrey", estDoc);
                        }, 50);
                        
                        // Passer au jour suivant
                        const nextDate = new Date(currentDate);
                        nextDate.setDate(currentDate.getDate() + 1);
                        currentDate = nextDate;
                    }
                }
            }

            for (const IR of tableauIR) {
                const journee = IR.journee;
                const h_debut = (IR.heure_debut.slice(0,2) - 8) * 6 + Math.floor(IR.heure_debut.slice(3,5) / 10);
                const h_fin = (IR.heure_fin.slice(0,2) - 8) * 6 + Math.floor(IR.heure_fin.slice(3,5) / 10) - 1;
                const dateDebutSemaine = new Date(date);
                dateDebutSemaine.setDate(date.getDate() + offsetjour + 1 - indice_jour);

                const jourtoindice = new Map([
                    ["LUN",0],
                    ["MAR",1],
                    ["MER",2],
                    ["JEU",3],
                    ["VEN",4],
                    ["SAM",5],
                    ["DIM",6],
                ]);
                const indice = jourtoindice.get(journee);
                const jour = new Date(dateDebutSemaine);
                jour.setDate(dateDebutSemaine.getDate() + indice);
                const jourStr = jour.toLocaleDateString("fr-FR");
                setTimeout(() => {
                    create_rdv(h_debut, h_fin, jourStr, jourStr, "darkgrey", estDoc);
                }, 50);



            }

        } else {
            var result = await fetch(`/info2/site/PHP/get-data.php?action=rdvs&id_patient=${id}`);
            
            
        }
        const tableauRDV = await result.json();

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

                //const couleurRdv = estDoc ? couleur : "grey";

                setTimeout(() => {
                    create_rdv(h_debut, h_fin, jourStr, jourStr, couleur, nom, estDoc);
                }, 50);

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
    if (!document.querySelector('.HC')) {
        // Créer l'image
        const img = document.createElement('img');
        img.src = "/info2/site/images/cal.png";
        img.alt = "Haut du calendrier";
        img.className = "HC";
        
        // Insérer l'image avant la section selecteur
        const selecteur = document.querySelector('.selecteur');
        if (selecteur) {
            selecteur.parentNode.insertBefore(img, selecteur);
        }
    }


    maj_date();
    maj_id();
    maj_rdv();

     setTimeout(() => {
        const event = new CustomEvent('weekChanged');
        window.dispatchEvent(event);
        chargerEtAfficherRDV();
    }, 1000);
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
        // Remove classes
        e.classList.remove("custom_bg_color", "custom_border_top", "invisible_border_top", "invisible_border_bottom");
        
        // Clear inline styles
        e.style.boxShadow = "";
        e.style.borderTop = "";
        e.style.borderBottom = "";
        e.style.position = "";
        e.style.zIndex = "";
        e.style.backgroundColor = "";
        
        // Safer approach: reset all inline styles
        e.removeAttribute("style");
    });
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
    //chargerEtAfficherRDV();
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

async function create_rdv(horaire_debut, horaire_fin, journee, journee_fin = journee, color, nom, estDoc = false) {
    if (horaire_debut > -1 && horaire_fin < 72 && document.getElementById(journee)) {
        for (let i = horaire_debut; i <= horaire_fin; i++) {
            const creneau = document.getElementById(journee + i);
            if (!creneau) continue;
            
            creneau.style.setProperty('--border-color', color);
            creneau.classList.add("custom_bg_color");
            
            creneau.style.boxShadow = "none";
            
            if (i > horaire_debut && i < horaire_fin) {
                creneau.style.borderTop = "0px solid transparent";
                creneau.style.borderBottom = "0px solid transparent";
            }
            
            if (i === horaire_debut) {
                if (i > 0) {
                    creneau.style.boxShadow = "0px -1px 0px 0px black";
                }
                creneau.style.borderBottom = "0px solid transparent";
                creneau.style.position = "relative";
                creneau.style.zIndex = "1";
            }
            
            if (i === horaire_fin) {
                creneau.style.boxShadow = "0px 1px 0px 0px black";
                creneau.style.borderTop = "0px solid transparent";
                creneau.style.position = "relative";
                creneau.style.zIndex = "0";
            }
        }
        
        const premierCreneau = document.getElementById(journee + horaire_debut);
        if (premierCreneau && !premierCreneau.querySelector(".rdv")) {
            const box = create("article", premierCreneau);
            box.classList.add("rdv");
            
            const toggleButton = create("div", box, "Afficher les détails");
            toggleButton.classList.add("toggle_button");
            toggleButton.style.fontSize = "0.8rem";
            
            const details = create("div", box);
            details.classList.add("rdv_details");
            details.style.display = "none";
            
            const [day, month, year] = journee.split("/").map(Number);
            const dateObj = new Date(year, month - 1, day);
            create("p", details, `Date : ${dateObj.toLocaleDateString("fr-FR")}`);
            create("p", details, calcul_duree(horaire_debut, horaire_fin - horaire_debut + 1));
            if (estDoc) {
                create("p", details, `Nom : ${nom}`);
            }
            
            toggleButton.addEventListener("click", () => {
                details.style.display = details.style.display === "none" ? "block" : "none";
            });
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




function rdvsIdentiques(a, b) {
    return a.nom_utilisateur === b.nom_utilisateur &&
           a.date_debut === b.date_debut &&
           a.date_fin === b.date_fin;
}

async function diffEtMetAJourRDV(nouveauxRDV) {
    const ajoutes = [];

    document.querySelectorAll('.rdv').forEach(e => e.remove());

    for (const nouveau of nouveauxRDV) {
        const existeDeja = anciensRDV.some(ancien => rdvsIdentiques(ancien, nouveau));
        if (!existeDeja) {
            ajoutes.push(nouveau);
        }
    }

    for (const rdv of ajoutes) {
        const nom = rdv.nom_utilisateur;
        const couleur = rdv.couleur;
        const debut = new Date(rdv.date_debut.replace(' ', 'T'));
        const fin = new Date(rdv.date_fin.replace(' ', 'T'));

        const jourStr = debut.toLocaleDateString("fr-FR");
        const h_debut = (debut.getHours() - 8) * 6 + Math.floor(debut.getMinutes() / 10);
        const h_fin = (fin.getHours() - 8) * 6 + Math.floor(fin.getMinutes() / 10) - 1;

        const dureeMinutes = (fin - debut) / 60000; 
        let couleurRdv = "gray"; 

        if (dureeMinutes <= 10) couleurRdv = "#b6fcb6";       
        else if (dureeMinutes <= 20) couleurRdv = "#ffe0b3";   
        else if (dureeMinutes <= 30) couleurRdv = "#ffb3b3";  

        await create_rdv(h_debut, h_fin, jourStr, jourStr, couleurRdv, nom, estDoc);
    }

    anciensRDV = nouveauxRDV;
}

// ^^^

window.cal_create_rdv = create_rdv;
window.cal_maj_rdv = maj_rdv;
window.cal_chargerEtAfficherRDV = chargerEtAfficherRDV;

