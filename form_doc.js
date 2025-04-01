// Form toggle functionality
function toggleForm(formType) {
    if (formType === 'repetitif') {
        document.getElementById('form-repetitif').classList.remove('hidden');
        document.getElementById('form-temporaire').classList.add('hidden');
        document.getElementById('tab-repetitif').classList.add('active');
        document.getElementById('tab-repetitif').classList.remove('inactive');
        document.getElementById('tab-temporaire').classList.remove('active');
        document.getElementById('tab-temporaire').classList.add('inactive');
    } else {
        document.getElementById('form-repetitif').classList.add('hidden');
        document.getElementById('form-temporaire').classList.remove('hidden');
        document.getElementById('tab-repetitif').classList.remove('active');
        document.getElementById('tab-repetitif').classList.add('inactive');
        document.getElementById('tab-temporaire').classList.add('active');
        document.getElementById('tab-temporaire').classList.remove('inactive');
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