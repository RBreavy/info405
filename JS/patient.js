let selectedDoctorId = null;
let selectedDoctorName = null;

// Chargement initial - affiche la liste des médecins
document.addEventListener('DOMContentLoaded', () => {
    loadDoctors();
    setupEventListeners();
});

async function loadDoctors() {
    try {
        const response = await fetch('calendrier/get-data.php?action=doctors');
        const doctors = await response.json();
        displayDoctors(doctors);
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de charger la liste des médecins');
    }
}

function displayDoctors(doctors) {
    const doctorList = document.querySelector('.doctor-list');
    doctorList.innerHTML = '';

    doctors.forEach(doctor => {
        const doctorButton = document.createElement('button');
        doctorButton.className = 'doctor-button';
        doctorButton.textContent = doctor.nom;
        doctorButton.dataset.id = doctor.id_medecin;
        doctorButton.dataset.name = doctor.nom;
        
        doctorButton.addEventListener('click', () => {
            selectDoctor(doctor.id_medecin, doctor.nom);
        });
        
        doctorList.appendChild(doctorButton);
    });
}

function selectDoctor(doctorId, doctorName) {
    selectedDoctorId = doctorId;
    selectedDoctorName = doctorName;
    
    // Mise à jour de l'UI
    document.querySelector('.doctor-selection').style.display = 'none';
    document.querySelector('.appointment-form').style.display = 'block';
    document.getElementById('selected-doctor-name').textContent = doctorName;
    
    // Charger les RDV existants pour ce médecin
    loadAppointments(doctorId);
}

function setupEventListeners() {
    // Annulation du formulaire
    document.getElementById('cancel-appointment').addEventListener('click', () => {
        document.querySelector('.appointment-form').style.display = 'none';
        document.querySelector('.doctor-selection').style.display = 'block';
        document.getElementById('rdv-form').reset();
    });
    
    // Soumission du formulaire
    document.getElementById('rdv-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const date = document.getElementById('rdv-date').value;
        const time = document.getElementById('rdv-time').value;
        const duration = parseInt(document.getElementById('rdv-duration').value);
        
        if (!date || !time || !duration) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        
        const startDateTime = `${date}T${time}`;
        const endDateTime = calculateEndTime(startDateTime, duration);
        
        const json = JSON.stringify({
            id_medecin: selectedDoctorId,
            id_utilisateur: userId,
            date_debut: startDateTime,
            date_fin: endDateTime,
            couleur: 'blue'
        });

        try {
            
            console.log(json);
            const response = await fetch('/info2/site/PHP/rendez_vous.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: json
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Rendez-vous enregistré avec succès!');
                loadAppointments(selectedDoctorId);
                document.getElementById('rdv-form').reset();
            } else {
                alert(result.message || 'Erreur lors de la prise de rendez-vous');
            }
        } catch (error) {
            alert('Erreur lors de la communication avec le serveur');
        }
    });
}

function calculateEndTime(startDateTime, duration) {
    const start = new Date(startDateTime);
    start.setMinutes(start.getMinutes() + duration);
    return start.toISOString().slice(0, 16).replace('T', ' ');
}

async function loadAppointments(doctorId) {
    try {
        const response = await fetch(`calendrier/get-data.php?action=getRdvsByDoctor&id_medecin=${doctorId}`);
        const appointments = await response.json();
        displayAppointments(appointments);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function displayAppointments(appointments) {
    // Nettoyage des anciens RDV affichés
    const oldAppointments = document.querySelectorAll('.rdv, .custom_bg_color');
    oldAppointments.forEach(el => el.remove());
    
    // Réinitialisation des styles des créneaux
    const allSlots = document.querySelectorAll('[id^="creneau"]');
    allSlots.forEach(slot => {
        slot.classList.remove('custom_bg_color', 'custom_border_top', 'invisible_border_top', 'invisible_border_bottom');
        slot.style.removeProperty('--border-color');
    });

    // Affichage des nouveaux RDV
    appointments.forEach(rdv => {
        const startTime = new Date(rdv.date_debut);
        const endTime = new Date(rdv.date_fin);
        
        // Conversion en format compatible avec votre système
        const day = startTime.toLocaleDateString('fr-FR');
        const startSlot = timeToSlot(startTime);
        const duration = (endTime - startTime) / (1000 * 60 * 10); // Durée en créneaux de 10 min
        
        // Application du style pour ce RDV
        applyAppointmentStyle(day, startSlot, duration, rdv.couleur || 'blue');
    });
}

function timeToSlot(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Convertit l'heure en créneau (ex: 8h00 = 0, 8h10 = 1, etc.)
    return (hours - 8) * 6 + (minutes / 10);
}

function applyAppointmentStyle(day, startSlot, duration, color) {
    for (let i = startSlot; i < startSlot + duration; i++) {
        const slotId = `${day.replace(/\//g, '')}${i}`;
        const slotElement = document.getElementById(slotId);
        
        if (!slotElement) continue;
        
        // Style de base pour le créneau
        slotElement.style.setProperty('--border-color', color);
        slotElement.classList.add('custom_bg_color');
        
        // Gestion des bordures (votre logique existante)
        if (i === startSlot) {
            // Création du bloc de RDV qui couvre toute la durée
            const appointmentBlock = document.createElement('div');
            appointmentBlock.className = 'rdv';
            appointmentBlock.style.backgroundColor = color;
            appointmentBlock.style.height = `${slotElement.offsetHeight * duration - 3}px`;
            appointmentBlock.style.zIndex = '10';
            slotElement.appendChild(appointmentBlock);
            
            if (i % 6 !== 0) {
                slotElement.classList.add('invisible_border_top');
            }
        }
        
        if (i % 6 === 0 && i !== startSlot) {
            slotElement.classList.add('custom_border_top');
        }
        
        if (i === Math.floor(startSlot + duration - 1) && (i + 1) % 6 !== 0) {
            slotElement.classList.add('invisible_border_bottom');
        }
    }
}