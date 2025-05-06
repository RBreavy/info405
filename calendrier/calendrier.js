function creation_jour() {
    const jours = document.querySelector(".jours");
    jours.innerHTML = "";

    const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const today = new Date();
    const debutSemaine = new Date(today.setDate(today.getDate() - today.getDay()));

    for (let i = 0; i < 7; i++) {
        const jour = new Date(debutSemaine);
        jour.setDate(debutSemaine.getDate() + i);

        const div = document.createElement("div");
        div.classList.add("jour");
        div.dataset.date = jour.toISOString().split("T")[0];

        const header = document.createElement("div");
        header.classList.add("jour-header");
        header.textContent = `${joursSemaine[jour.getDay()]} ${jour.getDate()}/${jour.getMonth() + 1}`;
        div.appendChild(header);

        for (let j = 0; j < 72; j++) {
            const caseHeure = document.createElement("div");
            caseHeure.classList.add("case");
            caseHeure.dataset.index = j;
            div.appendChild(caseHeure);
        }

        jours.appendChild(div);
    }

    chargerRendezVous(); // Ajout ici
}

function parseSQLDateToInfos(date_debut, date_fin) {
    const d1 = new Date(date_debut);
    const d2 = new Date(date_fin);
    
    const jour = d1.toLocaleDateString("fr-FR");

    const h_dbt = d1.getHours();
    const m_dbt = Math.round(d1.getMinutes() / 10);
    const h_fin = d2.getHours();
    const m_fin = Math.round(d2.getMinutes() / 10);

    const debut = (h_dbt - 8) * 6 + m_dbt;
    const fin = (h_fin - 8) * 6 + m_fin - 1;

    return {
        jour,
        debut,
        fin
    };
}

async function chargerRendezVous() {
    const response = await fetch("get-data.php?action=rdvs");
    const data = await response.json();

    data.forEach(rdv => {
        const infos = parseSQLDateToInfos(rdv.date_debut, rdv.date_fin);
        create_rdv(
            infos.debut,
            infos.fin,
            infos.jour,
            rdv.couleur || "yellow",
            rdv.nom_medecin + " - " + rdv.nom_utilisateur
        );
    });
}

function maj_rdv() {
    let rdv = document.querySelectorAll(".rdv");
    rdv.forEach(e => {
        e.remove();
    });

    let rdv_color = document.querySelectorAll(".custom_bg_color");
    rdv_color.forEach(e => {function create_rdv(indexDebut, indexFin, jour, couleur, texte) {
        console.log(`Création du RDV : Début : ${indexDebut}, Fin : ${indexFin}, Jour : ${jour}, Couleur : ${couleur}`);
        for (let i = indexDebut; i < indexFin; i++) {
            const cellule = document.querySelector(`.case[data-index="${i}"][data-jour="${jour}"]`);
            if (cellule) {
                cellule.style.backgroundColor = couleur;
                cellule.textContent = texte;
            }
        }
    }
    
    function parseSQLDateToInfos(sqlDate) {
        const date = new Date(sqlDate);
        const heure = date.getHours();
        const minutes = date.getMinutes();
        const jour = date.getDay(); // 0 (dimanche) à 6 (samedi)
    
        const jours = [1, 2, 3, 4, 5]; // Lundi à vendredi
        const jourIndex = jours.includes(jour) ? jour - 1 : null; // 0 à 4
    
        if (jourIndex === null) return null; // Ignore les week-ends
    
        const totalMinutes = heure * 60 + minutes;
        const index = Math.floor((totalMinutes - 480) / 10); // 480 = 8h00
    
        if (index < 0 || index >= 72) return null; // Hors créneaux
    
        return {
            index,
            jour: jourIndex
        };
    }
    
    async function chargerRendezVous() {
        try {
            const response = await fetch("/info2/site/get-data.php?action=rdvs");
            const data = await response.json();
            console.log("RDVs récupérés :", data); // pour debug
    
            data.forEach(rdv => {
                const { date_debut, date_fin, nom_medecin, nom_utilisateur } = rdv;
                const infosDebut = parseSQLDateToInfos(date_debut);
                const infosFin = parseSQLDateToInfos(date_fin);
    
                if (!infosDebut || !infosFin) return;
    
                create_rdv(
                    infosDebut.index,
                    infosFin.index,
                    infosDebut.jour,
                    "blue",
                    `${nom_medecin} (${nom_utilisateur})`
                );
            });
        } catch (e) {
            console.error("Erreur lors du chargement des RDV :", e);
        }
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        chargerRendezVous();
    });
    
        e.classList.remove("custom_bg_color");
        e.classList.remove("custom_border_top");
        e.classList.remove("invisible_border_top");
        e.classList.remove("invisible_border_bottom");
    });

    chargerRendezVous();
}
