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
        
        console.log('Repetitive Schedule:', { day: selectedDay, startTime, endTime });
    
    } else {
        
        const startDate = document.querySelector('#form-temporaire input[type="date"]:nth-of-type(1)').value;
        const endDate = document.querySelector('#form-temporaire input[type="date"]:nth-of-type(2)').value;
        const startTime = document.querySelector('#form-temporaire input[type="time"]:nth-of-type(1)').value;
        const endTime = document.querySelector('#form-temporaire input[type="time"]:nth-of-type(2)').value;
        
        console.log('Temporary Schedule:', { startDate, endDate, startTime, endTime });
        
    }
    
    
    alert('Disponibilités enregistrées avec succès!');
}

document.addEventListener('DOMContentLoaded', function() {
    toggleForm('repetitif');
});