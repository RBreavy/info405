function create_rdv(horaire_debut,duree,journee,color="yellow",texte) {
    let horaire_fin = horaire_debut+duree;
    if (horaire_debut>-1 && horaire_fin<72 && document.getElementById(journee) !== null) {
        for (let i = horaire_debut; i<=horaire_fin; i++) {
            var creneau_horaire = document.getElementById(journee.toString()+i.toString())
            creneau_horaire.style.setProperty('--border-color', color);
            creneau_horaire.classList.add("custom_bg_color");
            
            if (i == horaire_debut) {
                let box_invisible = create("article",creneau_horaire);
                create("p",box_invisible,texte);
                create("p",box_invisible,calcul_duree(horaire_debut,duree));
                box_invisible.classList.add("rdv")
                box_invisible.style.height = creneau_horaire.offsetHeight* (duree+1) -3+"px";
            }
            
    
            if (i%6 == 0 && i != horaire_debut) {
                creneau_horaire.classList.add('custom_border_top');
            } 
    
            if (i == horaire_debut && i%6 !=0) {
                creneau_horaire.classList.add("invisible_border_top")
            }
            
            if (i == horaire_fin && (i+1)%6 != 0) {
                console.log(i)
                creneau_horaire.classList.add("invisible_border_bottom")
            }
          
        }
    }
}

async function getNomDoc() {
 try {
    let lrdv;
    let response = await fetch('calendrier/get-data.php?action=doctors');
    lrdv = await response.json();
    affichage_menu_selection(lrdv);
} catch(error) {
    console.error(error);
}
}

getNomDoc();

function affichage_menu_selection(lrdv) {
    let container = document.querySelector(".docteur");
    
 
    container.innerHTML = "";
    
   
    lrdv.forEach(doc => {
        let button = create("input",container);
        button.type = "button";
        button.value = doc.nom;
        button.id = doc.id_medecin;
        button.classList.add("bouton-docteur");
        button.addEventListener("click",_ => {getRDV(button.id)});
    });
}


async function getRDV(id){
    try {
        let lrdv;
        let response = await fetch('calendrier/get-data.php');
        lrdv = await response.json(lrdv);
        let new_lrdv = [];
        lrdv.forEach(rdv => {
            if (rdv.id_medecin = id) {
                new_lrdv.push(rdv);
            }
        })
        affichage_indisponiblite(lrdv);
      } catch(error) {
        console.error(error);
      }
}


function affichage_indisponiblite(lrdv) {
    lrdv.forEach(rdv => {
        console.log(rdv);
    });
}

// Création du formulaire de rendez-vous
function selection_creneau() {
    let container = document.querySelector(".docteur");
    container.innerHTML = "";
    const form = create("form", container);
    form.id = "rdv-form";
    
    // Titre du formulaire
    create("h2", form, "Prise de rendez-vous");
    
    // Section pour la date
    const dateContainer = create("div", form);
    dateContainer.className = "form-group";
    
    // Label et input pour la date
    const dateLabel = create("label", dateContainer);
    dateLabel.htmlFor = "rdv-date";
    dateLabel.textContent = "Date du rendez-vous:";
    
    const dateInput = create("input", dateContainer);
    dateInput.type = "date";
    dateInput.id = "rdv-date";
    dateInput.name = "rdv-date";
    dateInput.required = true;
    
    // Section pour l'heure
    const timeContainer = create("div", form);
    timeContainer.className = "form-group";
    
    // Label et input pour l'heure
    const timeLabel = create("label", timeContainer);
    timeLabel.htmlFor = "rdv-time";
    timeLabel.textContent = "Heure du rendez-vous:";
    
    const timeInput = create("input", timeContainer);
    timeInput.type = "time";
    timeInput.id = "rdv-time";
    timeInput.name = "rdv-time";
    timeInput.min = "08:00"; // Heure d'ouverture
    timeInput.required = true;
    
    // Section pour la durée
    const durationContainer = create("div", form);
    durationContainer.className = "form-group";
    
    // Label et select pour la durée
    const durationLabel = create("label", durationContainer);
    durationLabel.htmlFor = "rdv-duration";
    durationLabel.textContent = "Durée du rendez-vous:";
    
    const durationSelect = create("select", durationContainer);
    durationSelect.id = "rdv-duration";
    durationSelect.name = "rdv-duration";
    durationSelect.required = true;
    
    // Options pour la durée
    const durations = [10, 20, 30, 40];
    durations.forEach(duration => {
        const option = create("option", durationSelect, `${duration} minutes`);
        option.value = duration;
    });
    
    // Bouton de soumission
    const submitButton = create("button", form, "Prendre rendez-vous");
    submitButton.type = "submit";
    
    // Ajout de la validation pour s'assurer que le rendez-vous se termine avant 20h
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const timeValue = timeInput.value;
        const durationValue = parseInt(durationSelect.value);
        
        if (timeValue) {
            // Extraire les heures et minutes
            const [hours, minutes] = timeValue.split(':').map(Number);
            
            // Calculer l'heure de fin
            let endMinutes = minutes + durationValue;
            let endHours = hours + Math.floor(endMinutes / 60);
            endMinutes = endMinutes % 60;
            
            // Vérifier si le rendez-vous se termine avant 20h
            if (endHours > 20 || (endHours === 20 && endMinutes > 0)) {
                alert("Le rendez-vous doit se terminer au plus tard à 20h00.");
                return false;
            }
            
            // Si tout est valide, on peut soumettre le formulaire
            alert(`Rendez-vous programmé le ${dateInput.value} à ${timeInput.value} pour une durée de ${durationValue} minutes.`);
            // Ici, vous pouvez ajouter le code pour envoyer les données au serveur
        }
    });
}