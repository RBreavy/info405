const dateString = new Date().toLocaleDateString("fr-FR");
// Déstructure la chaîne en jour, mois, année
let [day, month, year] = dateString.split('/').map(Number);
// Crée un objet Date avec les valeurs récupérées
let date = new Date(year, month - 1, day);

// Récupère l'indice du jour dans la semaine (0 pour dimanche à 6 pour samedi)
let indice_jour = date.getDay();
// Décalage utilisé pour naviguer entre les semaines
let offsetjour = 0;
// Si dimanche, on le considère comme jour 7 pour avoir lundi=1 à dimanche=7
if (indice_jour === 0) indice_jour = 7;

// Récupère l'utilisateur actuellement connecté
let nomUtilisateur = window.nomUtilisateur || "";

async function estMedecin(nom) {
    const response = await fetch('/info2/site/PHP/get-data.php?action=doctors');
    const tableauDOC = await response.json();
    return tableauDOC.some(doc => doc.nom === nom);
}

// Récupère l'élément input de type date
const dateInput = document.getElementById("calendrier");

// Écouteur d'événement pour le changement de date
dateInput.addEventListener('change', () => {
    [year, month, day] = dateInput.value.split("-").map(Number);
    if (year >= 2000 && year <= 2100) {
        console.log("Date sélectionnée:", dateInput.value);
        dateInput.value = "";
        date = new Date(year, month - 1, day);
        indice_jour = date.getDay();
        offsetjour = 0;
        if (indice_jour === 0) indice_jour = 7;
        maj_semaine();
    }
});

const main = document.querySelector(".main_cal");
const listeJour = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

creation_jour();

async function chargerEtAfficherRDV() {
    const dateDebutSemaine = new Date(date);
    dateDebutSemaine.setDate(date.getDate() + offsetjour + 1 - indice_jour);
    const dateFinSemaine = new Date(dateDebutSemaine);
    dateFinSemaine.setDate(dateDebutSemaine.getDate() + 6);

    try {
        const response = await fetch('/info2/site/PHP/get-data.php?action=rdvs');
            const debut = new Date(rdv.date_debut.replace(' ', 'T'));
            const fin = new Date(rdv.date_fin.replace(' ', 'T'));

            if ((debut >= dateDebutSemaine && debut <= dateFinSemaine) ||
                (fin >= dateDebutSemaine && fin <= dateFinSemaine) ||
                (debut <= dateDebutSemaine && fin >= dateFinSemaine)) {

                const jourStr = debut.toLocaleDateString("fr-FR");
                const h_debut = (debut.getHours() - 8) * 6 + Math.floor(debut.getMinutes() / 10);
                const h_fin = (fin.getHours() - 8) * 6 + Math.floor(fin.getMinutes() / 10) - 1;

                const estDoc = await estMedecin(nom);
                const couleurRdv = estDoc ? couleur : "black";
                create_rdv(h_debut, h_fin, jourStr, jourStr, couleurRdv, nom);
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des RDV:", error);
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
        const datetemp = new Date(date);
        datetemp.setDate(date.getDate() + i + 1 - indice_jour);

        const div_jour = create("div", main);
        div_jour.classList.add("jour");

        const article = create("article", div_jour);
        article.classList.add("datejour");

        const date_jour = datetemp.toLocaleDateString();
        create("p", article, `${listeJour[i]}\n${date_jour}`);
        div_jour.id = date_jour;

        creation_crenau(i, div_jour, datetemp);

        if (i === 0) div_jour.classList.add("border_bottom_top_left");
        else if (i === 6) div_jour.classList.add("border_bottom_top_right", "border_right");
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
        dj.innerText = `${listeJour[index]}\n${date_jour}`;
    });
}

function maj_id() {
    const jours = document.querySelectorAll(".jour");
    jours.forEach(jour => {
        const creneaux = jour.querySelectorAll(".creneau");
        creneaux.forEach((c, i) => c.id = jour.id + i);
    });
}

function maj_rdv() {
    document.querySelectorAll(".rdv").forEach(e => e.remove());
    document.querySelectorAll(".custom_bg_color").forEach(e => e.classList.remove("custom_bg_color", "custom_border_top", "invisible_border_top", "invisible_border_bottom"));
    chargerEtAfficherRDV();
}

function creation_crenau(indexJour, divJour, datetemp) {
    let heure = 8;
    for (let j = 0; j < 72; j++) {
        const creneau = create("article", divJour);
        creneau.id = datetemp.toLocaleDateString() + j;
        creneau.classList.add("creneau");

        creneau.classList.add(Math.floor(j / 3) % 2 === 0 ? "gris_fonce" : "gris_clair");

        if (indexJour === 0 && j % 6 === 0) {
            const carre = create("div", creneau);
            carre.classList.add("carre_heure");
            const texte = create("p", carre, `${heure}h00`);
            texte.classList.add("heure");
            heure++;
        }

        if (j % 6 === 0) creneau.classList.add("border_top");
        if (j === 71 && indexJour === 0) creneau.classList.add("article_border_bottom_left_radius");
        else if (j === 71 && indexJour === 6) creneau.classList.add("article_border_bottom_right_radius");

        creneau.addEventListener("click", () => {
            console.log("Créneau cliqué:", creneau.id);
        });
    }
    chargerEtAfficherRDV();
}

function calcul_duree(hd, d) {
    const h1 = 8 + Math.floor((hd + 1) / 6), m1 = (hd % 6) * 10;
    const h2 = 8 + Math.floor((hd + d + 1) / 6), m2 = ((hd + d + 1) % 6) * 10;
    return `${h1}h${m1.toString().padStart(2, '0')} - ${h2}h${m2.toString().padStart(2, '0')}`;
}

async function create_rdv(hd, hf, jour, jourFin, color, texte) {
    const estDoc = await estMedecin(nomUtilisateur);
    if (hd > -1 && hf < 72 && document.getElementById(jour)) {
        for (let i = hd; i <= hf; i++) {
            const creneau = document.getElementById(jour + i);
            creneau.style.setProperty('--border-color', color);
            creneau.classList.add("custom_bg_color");

            if (i === hd) {
                const rdvBox = create("article", creneau);
                rdvBox.classList.add("rdv");
                rdvBox.style.height = creneau.offsetHeight * (hf - hd + 1) - 3 + "px";

                const btn = create("div", rdvBox, "Afficher les détails");
                btn.classList.add("toggle_button");

                const details = create("div", rdvBox);
                details.classList.add("rdv_details");
                details.style.display = "none";

                create("p", details, `Date : ${new Date(jour).toLocaleDateString()}`);
                if (estDoc) {
                    create("p", details, texte);
                }
                create("p", details, calcul_duree(hd, hf - hd - 1));

                btn.addEventListener("click", () => {
                    details.style.display = (details.style.display === "none") ? "block" : "none";
                    btn.innerText = details.style.display === "none" ? "Afficher les détails" : "Masquer les détails";
                });
            }

            if (i % 6 === 0 && i !== hd) creneau.classList.add("custom_border_top");
            if (i === hd && i % 6 !== 0) creneau.classList.add("invisible_border_top");
            if (i === hf && (i + 1) % 6 !== 0) creneau.classList.add("invisible_border_bottom");
        }
    }
}
async function create_rdv(hd, hf, jour, jourFin, color, texte) {




// Navigation gauche/droite entre les semaines avec animation
const boutonG = document.getElementsByClassName("selecteur_gauche")[0];
const boutonD = document.getElementsByClassName("selecteur_droit")[0];