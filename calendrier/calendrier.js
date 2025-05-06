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
    rdv_color.forEach(e => {
        e.classList.remove("custom_bg_color");
        e.classList.remove("custom_border_top");
        e.classList.remove("invisible_border_top");
        e.classList.remove("invisible_border_bottom");
    });

    chargerRendezVous();
}
