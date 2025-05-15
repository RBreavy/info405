function toggleForm(formType) {
    const formRepetitif = document.getElementById('form-repetitif');
    const formTemporaire = document.getElementById('form-temporaire');
    const tabRepetitif = document.getElementById('tab-repetitif');
    const tabTemporaire = document.getElementById('tab-temporaire');
    
    if (formType === 'repetitif') {
        
        formRepetitif.classList.remove('hidden');
        formTemporaire.classList.add('hidden');
        
        
        tabRepetitif.classList.add('active');
        tabRepetitif.classList.remove('inactive');
        tabTemporaire.classList.remove('active');
        tabTemporaire.classList.add('inactive');
    } else if (formType === 'temporaire') {
        
        formRepetitif.classList.add('hidden');
        formTemporaire.classList.remove('hidden');
        
        
        tabRepetitif.classList.remove('active');
        tabRepetitif.classList.add('inactive');
        tabTemporaire.classList.add('active');
        tabTemporaire.classList.remove('inactive');
    }
}

function changeSelection(day) {
    const buttons = document.querySelectorAll('.day-button');
    buttons.forEach(button => {
        if (button.classList.contains(day)) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

function recupForm() {
    const isRepetitif = !document.getElementById('form-repetitif').classList.contains('hidden');
    
    if (isRepetitif) {
        
        const selectedDay = document.querySelector('.day-button.selected').classList[1];
        const startTime = document.querySelector('#form-repetitif input[type="time"]:nth-of-type(1)').value;
        const endTime = document.querySelector('#form-repetitif input[type="time"]:nth-of-type(2)').value;
        
        console.log('Repetitive:', { day: selectedDay, startTime, endTime }); 

        if (startTime.slice(4) != "0" || endTime.slice(4) != "0") {
            alert("la durée doit forcément être en période de 10 minutes!");
        } else {
            addRep(selectedDay,startTime,endTime);
        }
    
    } else {
        
        const startDate = document.querySelector('#form-temporaire input[type="date"]:nth-of-type(1)').value;
        const endDate = document.querySelector('#form-temporaire input[type="date"]:nth-of-type(2)').value;
        const startTime = document.querySelector('#form-temporaire input[type="time"]:nth-of-type(3)').value;
        const endTime = document.querySelector('#form-temporaire input[type="time"]:nth-of-type(4)').value;

        
        console.log('Temporaire:', { startDate, endDate, startTime, endTime });

        if (startTime.slice(4) != "0" || endTime.slice(4) != "0") {
            alert("la durée doit forcément être en période de 10 minutes!");
        } else {
            const debut_periode = startDate + " " + startTime;
            const fin_periode = endDate + " " + endTime;
            addTemp(debut_periode,fin_periode);
        }
        
    }

}


async function addTemp(debut_periode,fin_periode) {
    try {
        const response = await fetch(`/info2/site/PHP/indisponibilite.php?action=temp&med=${id}&deb_p=${debut_periode}&fin_p=${fin_periode}`);
        const temp = await response.json();
        alert('Disponibilités enregistrées avec succès!');
        const dateDebutSemaine = new Date(date);
        dateDebutSemaine.setDate(date.getDate() + offsetjour + 1 - indice_jour);
            
            
        const dateFinSemaine = new Date(dateDebutSemaine);
        dateFinSemaine.setDate(dateDebutSemaine.getDate() + 6);
        dateFinSemaine.setHours(23, 59, 59);
        const debutIndisp = new Date(debut_periode.replace(' ', 'T'));
        const finIndisp = new Date(fin_periode.replace(' ', 'T'));

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
                    window.cal_create_rdv(h_debut, h_fin, jourStr, jourStr, "lightgrey", "", estDoc, false);
                }, 50);
                
                // Passer au jour suivant
                const nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + 1);
                currentDate = nextDate;
            }
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        alert("Impossible d'insérer cette indisponibilité!");
    }
}



async function addRep(journee,deb,fin) {
    try {
        const response = await fetch(`/info2/site/PHP/indisponibilite.php?action=repet&med=${id}&jour=${journee}&deb=${deb}&fin=${fin}`);
        const temp = await response.json();
        alert('Disponibilités enregistrées avec succès!');
        const h_debut = (deb.slice(0,2) - 8) * 6 + Math.floor(deb.slice(3,5) / 10);
        const h_fin = (fin.slice(0,2) - 8) * 6 + Math.floor(fin.slice(3,5) / 10) - 1;
        const dateDebutSemaine = new Date(date);
        dateDebutSemaine.setDate(date.getDate() + offsetjour + 1 - indice_jour);

        const jourtoindice = new Map([
            ["lun",0],
            ["mar",1],
            ["mer",2],
            ["jeu",3],
            ["ven",4],
            ["sam",5],
            ["dim",6],
        ]);
        const indice = jourtoindice.get(journee);
        const jour = new Date(dateDebutSemaine);
        jour.setDate(dateDebutSemaine.getDate() + indice);
        const jourStr = jour.toLocaleDateString("fr-FR");
        setTimeout(() => {
            create_rdv(h_debut, h_fin, jourStr, jourStr, "darkgrey", "", estDoc, false);
        }, 50);
    } catch (error) {
        console.error('Erreur:', error);
        alert("Impossible d'insérer cette indisponibilité!");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    toggleForm('repetitif');
});