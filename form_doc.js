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
        //const appointments = await response.json();
        alert('Disponibilités enregistrées avec succès!');
    } catch (error) {
        console.error('Erreur:', error);
        alert("Impossible d'insérer cette indisponibilité!");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    toggleForm('repetitif');
});