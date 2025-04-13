let idMedecinSelectionne = null;

// Fonction pour créer un élément DOM
function create(tag, parent, textContent = '') {
    const element = document.createElement(tag);
    if (textContent) {
        element.textContent = textContent;
    }
    if (parent) {
        parent.appendChild(element);
    }
    return element;
}

// Fonction pour récupérer la liste des médecins
async function getNomDoc() {
    try {
        let response = await fetch('info2/site/calendrier/get-data.php?action=doctors');
        let lrdv = await response.json();
        affichage_menu_selection(lrdv);
    } catch (error) {
        console.error('Erreur lors de la récupération des médecins:', error);
    }
}

// Appel initial pour récupérer les médecins
getNomDoc();

// Fonction pour afficher les médecins dans le menu de sélection
function affichage_menu_selection(lrdv) {
    let container = document.querySelector(".docteur");
    container.innerHTML = "";

    lrdv.forEach(doc => {
        let button = create("input", container);
        button.type = "button";
        button.value = doc.nom;
        button.id = doc.id_medecin;
        button.classList.add("bouton-docteur");
        button.addEventListener("click", () => {
            idMedecinSelectionne = button.id;
            getRDV(button.id);
        });
    });
}

// Fonction pour récupérer les rendez-vous d'un médecin
async function getRDV(id) {
    try {
        let response = await fetch(`get-data.php?action=getRdvsByDoctor&id_medecin=${id}`);
        let lrdv = await response.json();
        affichage_indisponiblite(lrdv);
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
    }
}

// Fonction pour convertir une date en un format temps
function DateEnTemps(date) {
    let [hours, minutes] = (date.slice(-8, -3)).split(':').map(Number);
    let hourValue = (hours - 8) * 6;
    let minuteValue = Math.floor(minutes / 10);
    return hourValue + minuteValue;
}

// Fonction pour afficher les indisponibilités
function affichage_indisponiblite(lrdv) {
    let ancienrdv = document.querySelectorAll(".rdv");
    ancienrdv.forEach(e => {
        e.remove();
    });
    let rdv_color = document.querySelectorAll(".custom_bg_color");
    rdv_color.forEach(e => {
        e.classList.remove("custom_bg_color", 'custom_border_top', "invisible_border_top", "invisible_border_bottom");
    });

    lrdv.forEach(rdv => {
        let debut = DateEnTemps(rdv.date_debut);
        let duree = DateEnTemps(rdv.date_fin) - DateEnTemps(rdv.date_debut);
        let jour = new Date(rdv.date_debut).toLocaleDateString('fr-FR');
        create_rdv2(debut, duree, jour);
    });
    selection_creneau();
}

// Fonction pour créer un rendez-vous visuellement
function create_rdv2(horaire_debut, duree, journee) {
    let horaire_fin = horaire_debut + duree;
    if (horaire_debut > -1 && horaire_fin < 72 && document.getElementById(journee) !== null) {
        for (let i = horaire_debut; i <= horaire_fin; i++) {
            var creneau_horaire = document.getElementById(journee.toString() + i.toString());
            creneau_horaire.style.setProperty('--border-color', "grey");
            creneau_horaire.classList.add("custom_bg_color");

            if (i == horaire_debut) {
                let box_invisible = create("article", creneau_horaire);
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

// Fonction pour créer le formulaire de prise de rendez-vous
function selection_creneau() {
    let container = document.querySelector(".docteur");
    container.innerHTML = "";
    const form = create("form", container);
    form.id = "rdv-form";

    create("h2", form, "Prise de rendez-vous");

    const dateContainer = create("div", form);
    dateContainer.className = "form-group";

    const dateLabel = create("label", dateContainer);
    dateLabel.htmlFor = "rdv-date";
    dateLabel.textContent = "Date du rendez-vous:";

    const dateInput = create("input", dateContainer);
    dateInput.type = "date";
    dateInput.id = "rdv-date";
    dateInput.name = "rdv-date";
    dateInput.required = true;

    const timeContainer = create("div", form);
    timeContainer.className = "form-group";

    const timeLabel = create("label", timeContainer);
    timeLabel.htmlFor = "rdv-time";
    timeLabel.textContent = "Heure du rendez-vous:";

    const timeInput = create("input", timeContainer);
    timeInput.type = "time";
    timeInput.id = "rdv-time";
    timeInput.name = "rdv-time";
    timeInput.min = "08:00";
    timeInput.required = true;

    const durationContainer = create("div", form);
    durationContainer.className = "form-group";

    const durationLabel = create("label", durationContainer);
    durationLabel.htmlFor = "rdv-duration";
    durationLabel.textContent = "Durée du rendez-vous:";

    const durationSelect = create("select", durationContainer);
    durationSelect.id = "rdv-duration";
    durationSelect.name = "rdv-duration";
    durationSelect.required = true;

    const durations = [10, 20, 30, 40];
    durations.forEach(duration => {
        const option = create("option", durationSelect, `${duration} minutes`);
        option.value = duration;
    });

    const submitButton = create("button", form, "Prendre rendez-vous");
    submitButton.type = "submit";

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!idMedecinSelectionne) {
            alert("Veuillez sélectionner un médecin.");
            return;
        }

        const timeValue = timeInput.value;
        const durationValue = parseInt(durationSelect.value);

        if (timeValue) {
            const [hours, minutes] = timeValue.split(':').map(Number);
            let endMinutes = minutes + durationValue;
            let endHours = hours + Math.floor(endMinutes / 60);
            endMinutes = endMinutes % 60;

            if (endHours > 20 || (endHours === 20 && endMinutes > 0)) {
                alert("Le rendez-vous doit se terminer au plus tard à 20h00.");
                return;
            }

            const date = dateInput.value;
            const startDateTime = new Date(`${date}T${timeValue}`);
            const endDateTime = new Date(startDateTime.getTime() + durationValue * 60000);

            fetch("info2/site/PHP/rendez-vous.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_medecin: idMedecinSelectionne,
                    id_utilisateur: userId,
                    couleur: "blue",
                    date_debut: startDateTime.toISOString(),
                    date_fin: endDateTime.toISOString()
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Rendez-vous bien enregistré !");
                    form.reset();
                } else {
                    alert("Erreur lors de l'enregistrement du rendez-vous.");
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi :", error);
                alert("Erreur lors de l'enregistrement du rendez-vous.");
            });
        }
    });
}
