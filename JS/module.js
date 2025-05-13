export async function create_rdv(horaire_debut, horaire_fin, journee, journee_fin = journee, color, nom, estDoc = false) {
    if (horaire_debut > -1 && horaire_fin < 72 && document.getElementById(journee)) {
        // Apply to all cells in appointment
        for (let i = horaire_debut; i <= horaire_fin; i++) {
            const creneau = document.getElementById(journee + i);
            if (!creneau) continue;
            
            // Apply background color
            creneau.style.setProperty('--border-color', color);
            creneau.classList.add("custom_bg_color");
            
            // Reset any previous styles
            creneau.style.boxShadow = "none";
            
            // Style inner cells (no visible borders)
            if (i > horaire_debut && i < horaire_fin) {
                creneau.style.borderTop = "0px solid transparent";
                creneau.style.borderBottom = "0px solid transparent";
            }
            
            // Style first cell - handle top edge case
            if (i === horaire_debut) {
                if (i > 0) { // Not at the very top
                    creneau.style.boxShadow = "0px -1px 0px 0px black";
                } // Leave original border if at the top
                creneau.style.borderBottom = "0px solid transparent";
                creneau.style.position = "relative";
                creneau.style.zIndex = "1";
            }
            
            // Style last cell
            if (i === horaire_fin) {
                creneau.style.boxShadow = "0px 1px 0px 0px black";
                creneau.style.borderTop = "0px solid transparent";
                creneau.style.position = "relative";
                creneau.style.zIndex = "1";
            }
        }
        
        // Rest of the code remains the same
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