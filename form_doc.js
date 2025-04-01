// Form toggle functionality
function toggleForm(formType) {
    // Get references to both forms and tabs
    const formRepetitif = document.getElementById('form-repetitif');
    const formTemporaire = document.getElementById('form-temporaire');
    const tabRepetitif = document.getElementById('tab-repetitif');
    const tabTemporaire = document.getElementById('tab-temporaire');
    
    if (formType === 'repetitif') {
        // Show repetitif form, hide temporaire form
        formRepetitif.classList.remove('hidden');
        formTemporaire.classList.add('hidden');
        
        // Update tab styles
        tabRepetitif.classList.add('active');
        tabRepetitif.classList.remove('inactive');
        tabTemporaire.classList.remove('active');
        tabTemporaire.classList.add('inactive');
    } else if (formType === 'temporaire') {
        // Hide repetitif form, show temporaire form
        formRepetitif.classList.add('hidden');
        formTemporaire.classList.remove('hidden');
        
        // Update tab styles
        tabRepetitif.classList.remove('active');
        tabRepetitif.classList.add('inactive');
        tabTemporaire.classList.add('active');
        tabTemporaire.classList.remove('inactive');
    }
}

// Day selection functionality
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

// Form submission
function recupForm() {
    // Get form data based on which form is active
    const isRepetitif = !document.getElementById('form-repetitif').classList.contains('hidden');
    
    if (isRepetitif) {
        // For repetitive schedule
        const selectedDay = document.querySelector('.day-button.selected').classList[1];
        const startTime = document.querySelector('#form-repetitif input[type="time"]:nth-of-type(1)').value;
        const endTime = document.querySelector('#form-repetitif input[type="time"]:nth-of-type(2)').value;
        
        console.log('Repetitive Schedule:', { day: selectedDay, startTime, endTime });
        // Here you would send this data to the server
    } else {
        // For temporary schedule
        const startDate = document.querySelector('#form-temporaire input[type="date"]:nth-of-type(1)').value;
        const endDate = document.querySelector('#form-temporaire input[type="date"]:nth-of-type(2)').value;
        const startTime = document.querySelector('#form-temporaire input[type="time"]:nth-of-type(1)').value;
        const endTime = document.querySelector('#form-temporaire input[type="time"]:nth-of-type(2)').value;
        
        console.log('Temporary Schedule:', { startDate, endDate, startTime, endTime });
        // Here you would send this data to the server
    }
    
    // You could show a confirmation message here
    alert('Disponibilités enregistrées avec succès!');
}

// Initialize the form on page load
document.addEventListener('DOMContentLoaded', function() {
    // Make sure the repetitif form is visible by default
    toggleForm('repetitif');
});