// Menu functionality
function openNav() {
    document.getElementById("mySidenav").style.left = "0";
}

function closeNav() {
    document.getElementById("mySidenav").style.left = "-250px";
}

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

// Make sure calendar days are added to the container
document.addEventListener('DOMContentLoaded', function() {
    // This code assumes that the calendar.js script will create and append
    // the jour elements to the main_cal
    // If needed, you can add a MutationObserver to ensure they're placed
    // in the calendar-days-container
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('jour')) {
                        // Move jour elements to calendar-days-container
                        const container = document.querySelector('.calendar-days-container');
                        if (container && node.parentNode === document.querySelector('.main_cal')) {
                            container.appendChild(node);
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.querySelector('.main_cal'), { childList: true });
});