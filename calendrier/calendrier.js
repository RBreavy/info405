// Récupère la date actuelle au format français (JJ/MM/AAAA)
const dateString = new Date().toLocaleDateString("fr-FR");
// Déstructure la chaîne en jour, mois, année
var [day, month, year] = dateString.split('/').map(Number);
// Crée un objet Date avec les valeurs récupérées
var date = new Date(year, month - 1, day);

// Récupère l'indice du jour dans la semaine (0 pour dimanche à 6 pour samedi)
var indice_jour = date.getDay();

// Décalage utilisé pour naviguer entre les semaines
var offsetjour = 0;
// Si dimanche, on le considère comme jour 7 pour avoir lundi=1 à dimanche=7
if (indice_jour == 0) {
    indice_jour = 7;
}

async function estMedecin(nom) {
    const response = await fetch('/info2/site/calendrier/get-data.php?action=doctors');
    const tableauDOC = await response.json();
    return tableauDOC.some(doc => doc.nom === nom);
}

// Récupère l'élément input de type date (sélecteur de date)
var dateInput = document.getElementById("calendrier");

// Ajoute un écouteur d'événement pour changer la semaine selon la date choisie
dateInput.addEventListener('change', _ => {
    [year, month, day] = dateInput.value.split("-").map(Number);
    if (2000 <= year && year <= 2100) {
        console.log("Date sélectionnée:", dateInput.value);
        dateInput.value = "";
        date = new Date(year, month - 1, day);
        indice_jour = date.getDay();
        offsetjour = 0;
        maj_semaine();
    } 
});

// Récupère le conteneur principal du calendrier
var main = document.getElementsByClassName("main_cal")[0];
console.log("Element main:", main);

// Liste des jours de la semaine en français
var listeJour = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

// Crée les jours initiaux du calendrier
creation_jour();

async function chargerEtAfficherRDV() {
    const dateDebutSemaine = new Date(date);
    dateDebutSemaine.setDate(date.getDate() + offsetjour + 1 - indice_jour); // lundi
    const dateFinSemaine = new Date(dateDebutSemaine);
    dateFinSemaine.setDate(dateDebutSemaine.getDate() + 6); // dimanche

    try {
        const response = await fetch('/info2/site/calendrier/get-data.php?action=rdvs');
        const tableauRDV = await response.json();

        for (const rdv of tableauRDV) {
            const nom = rdv.nom_utilisateur;
            const couleur = rdv.couleur;
            const debut = new Date(rdv.date_debut.replace(' ', 'T'));
            const fin = new Date(rdv.date_fin.replace(' ', 'T'));

            if (
                (debut >= dateDebutSemaine && debut <= dateFinSemaine) ||
                (fin >= dateDebutSemaine && fin <= dateFinSemaine) ||
                (debut <= dateDebutSemaine && fin >= dateFinSemaine)
            ) {
                const jourStr = debut.toLocaleDateString("fr-FR");
                const h_debut = (debut.getHours() - 8) * 6 + Math.floor(debut.getMinutes() / 10);
                const h_fin = (fin.getHours() - 8) * 6 + Math.floor(fin.getMinutes() / 10) - 1;

                const estDoc = await estMedecin(nomUtilisateur);
                const couleurRdv = estDoc ? "black" : couleur;
                create_rdv(h_debut, h_fin, jourStr, jourStr, couleurRdv, nom);
            }
        }

        console.log("Rendez-vous affichés pour la semaine visible.");
    } catch (error) {
        console.error('Erreur lors du chargement des RDV:', error);
    }
}



// Fonction utilitaire pour créer un élément HTML avec du texte
function create(tag, container, text = null) {
    let element = document.createElement(tag);
    if (text) {
        element.innerText = text;
    }
    container.appendChild(element);
    return element;
}

// Création des colonnes jour par jour (lundi à dimanche)
function creation_jour() {
    console.log("Création des jours...");
    for (let i = 0; i < 7; i++) {
        let datetemp = new Date();
        datetemp.setDate(date.getDate() + i + 1 - indice_jour);

        let div_jour = create("div", main);
        div_jour.classList.add("jour");

        let article = create("article", div_jour);
        article.classList.add("datejour");

        let date_jour = datetemp.toLocaleDateString();
        create("p", article, listeJour[i] + "\n" + date_jour);
        div_jour.id = date_jour;

        creation_crenau(i, div_jour, datetemp);

        if (i == 0) {
            div_jour.classList.add("border_bottom_top_left");
        } else if (i == 6) {
            div_jour.classList.add("border_bottom_top_right");
            div_jour.classList.add("border_right");
        }
    }
    console.log("Jours créés.");
}

// Met à jour la semaine complète
function maj_semaine() {
    console.log("Mise à jour de la semaine...");
    maj_date();
    maj_id();
    maj_rdv();
    console.log("Semaine mise à jour.");
}

// Met à jour les dates affichées pour chaque jour
function maj_date() {
    console.log("Mise à jour des dates...");
    let jours = document.querySelectorAll(".jour");
    jours.forEach((e, index) => {
        let datetemp = new Date(year, month - 1, day);
        datetemp.setDate(date.getDate() + index + offsetjour + 1 - indice_jour);
        let date_jour = datetemp.toLocaleDateString();
        e.id = date_jour;
        let dj = e.querySelector(".datejour > p");
        dj.innerText = listeJour[index] + "\n" + date_jour;
    });
    console.log("Dates mises à jour.");
}

// Met à jour les ID des créneaux selon la date
function maj_id() {
    console.log("Mise à jour des ID...");
    let jour = document.querySelectorAll(".jour");
    jour.forEach(e => {
        let lC = e.querySelectorAll(".creneau");
        lC.forEach((creneau, index) => {
            creneau.id = e.id + index;
        });
    });
    console.log("ID mis à jour.");
}

// Supprime et recrée tous les rendez-vous selon la nouvelle date
function maj_rdv() {
    console.log("Mise à jour des rendez-vous...");
    let rdv = document.querySelectorAll(".rdv");
    rdv.forEach(e => e.remove());

    let rdv_color = document.querySelectorAll(".custom_bg_color");
    rdv_color.forEach(e => {
        e.classList.remove("custom_bg_color", "custom_border_top", "invisible_border_top", "invisible_border_bottom");
    });

    chargerEtAfficherRDV();

    console.log("Rendez-vous mis à jour."); 
}


// Création des créneaux horaires (72 par jour : 8h-20h en tranches de 10 minutes)
function creation_crenau(indice_div_jour, div_jour, datetemp) {
    let heure = 8;
    for (let j = 0; j < 72; j++) {
        let article_creneau = create("article", div_jour);
        article_creneau.id = datetemp.toLocaleDateString() + j.toString();
        article_creneau.classList.add("creneau");

        // Alternance de couleurs pour lisibilité
        if (Math.floor(j / 3) % 2 == 0) {
            article_creneau.classList.add("gris_fonce");
        } else {
            article_creneau.classList.add("gris_clair");
        }

        // Affichage de l'heure toutes les heures (6 créneaux de 10min)
        if (indice_div_jour == 0 && j % 6 == 0) {
            let carre_heure = create("div", article_creneau);
            carre_heure.classList.add("carre_heure");
            let texte = create("p", carre_heure, heure + "h00");
            heure++;
            texte.classList.add("heure");
        }

        // Bordures de séparation
        if (j % 6 == 0) {
            article_creneau.classList.add("border_top");
        }

        if (j == 71) {
            if (indice_div_jour == 0) {
                article_creneau.classList.add("article_border_bottom_left_radius");
            } else if (indice_div_jour == 6) {
                article_creneau.classList.add("article_border_bottom_right_radius");
            }
        }

        // Écouteur de clic sur un créneau
        article_creneau.addEventListener("click", _ => {
            console.log("Créneau cliqué:", article_creneau.id);
        });
    }
    console.log(`Créneaux pour ${datetemp.toLocaleDateString()} créés.`);
    chargerEtAfficherRDV();
}

// Calcule et retourne la durée d’un rendez-vous sous forme textuelle
function calcul_duree(heure_debut, duree) {
    let h_dbt_rdv = (8 + Math.floor((heure_debut + 1) / 6)).toString() + "h";
    let m_dbt_rdv = (heure_debut % 6).toString();
    let h_fin_rdv = (8 + Math.floor((heure_debut + duree + 1) / 6)).toString() + "h";
    let m_fin_rdv = ((heure_debut + duree + 1) % 6).toString();

    if (m_dbt_rdv.length == 1) m_dbt_rdv += "0";
    if (m_fin_rdv.length == 1) m_fin_rdv += "0";

    return (h_dbt_rdv + m_dbt_rdv + " - " + h_fin_rdv + m_fin_rdv);
}

// Convertit une heure en index de créneau
function conversion_heure_en_id(heure_debut) {
    let int_h = (parseInt(heure_debut.slice(0, 2)) - 8) * 6 + parseInt(heure_debut.slice(3, 4));
    console.log("Conversion de l'heure:", heure_debut, "=>", int_h);
    return int_h;
}

// Crée un rendez-vous sur plusieurs créneaux, avec couleur et texte
function create_rdv(horaire_debut, horaire_fin, journee, journee_fin = journee, color, texte) {
    let duree = 30;
    console.log(`Création d'un rendez-vous: ${journee} ${horaire_debut}-${horaire_fin} ${color}`);
    if (horaire_debut > -1 && horaire_fin < 72 && document.getElementById(journee) !== null) {
        for (let i = horaire_debut; i <= horaire_fin; i++) {
            var creneau_horaire = document.getElementById(journee.toString() + i.toString());
            creneau_horaire.style.setProperty('--border-color', color);
            creneau_horaire.classList.add("custom_bg_color");

            if (i == horaire_debut) {
                let box_invisible = create("article", creneau_horaire);
                // create("p", box_invisible, texte);
                // create("p", box_invisible, calcul_duree(horaire_debut, duree));
                // create("p", box_invisible, calcul_duree(horaire_debut, horaire_fin - horaire_debut - 1));
                box_invisible.classList.add("rdv");
                box_invisible.style.height = creneau_horaire.offsetHeight * (duree + 1) - 3 + "px";
            }

            if (i % 6 == 0 && i != horaire_debut) {
                creneau_horaire.classList.add('custom_border_top');
            }

            if (i == horaire_debut && i % 6 != 0) {
                creneau_horaire.classList.add("invisible_border_top");
            }

            if (i == horaire_fin && (i + 1) % 6 != 0) {
                creneau_horaire.classList.add("invisible_border_bottom");
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
