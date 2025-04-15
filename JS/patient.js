let selectedDoctorId = null;
let selectedDoctorName = null;

document.addEventListener('DOMContentLoaded', () => {
    loadDoctors();
    setupEventListeners();
});

async function loadDoctors() {
    try {
        const response = await fetch('/info2/site/calendrier/get-data.php?action=doctors');
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
        const button = document.createElement('button');
        button.className = 'doctor-button';
        button.textContent = doctor.nom;
        button.dataset.id = doctor.id_medecin;

        button.addEventListener('click', () => {
            selectDoctor(doctor.id_medecin, doctor.nom);
        });

        doctorList.appendChild(button);
    });
}

function selectDoctor(id, name) {
    selectedDoctorId = id;
    selectedDoctorName = name;

    document.querySelector('.doctor-selection').style.display = 'none';
    document.querySelector('.appointment-form').style.display = 'block';
    document.getElementById('selected-doctor-name').textContent = name;

    loadAppointments(id);
}

function setupEventListeners() {
    console.log(selectedDoctorId);

    document.getElementById('cancel-appointment').addEventListener('click', () => {
        document.querySelector('.appointment-form').style.display = 'none';
        document.querySelector('.doctor-selection').style.display = 'block';
        document.getElementById('rdv-form').reset();
    });

    document.getElementById('rdv-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const date = document.getElementById('rdv-date').value;
        const time = document.getElementById('rdv-time').value;
        const duration = parseInt(document.getElementById('rdv-duration').value);

        if (!date || !time || !duration) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

        const formatDateTime = (dateObj) => {
            const pad = n => n.toString().padStart(2, '0');
            return `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:00`;
        };

        const payload = {
            id_medecin: selectedDoctorId,
            id_utilisateur: "userId", // recup util
            couleur: 'blue',
            date_debut: formatDateTime(startDateTime),
            date_fin: formatDateTime(endDateTime)
        };
    
        console.log('Payload to send:', payload);

        try {
            const response = await fetch('/info2/site/PHP/rendez_vous.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                alert('Rendez-vous enregistré avec succès!');
                document.getElementById('rdv-form').reset();
                //loadAppointments(selectedDoctorId);
            } else {
                alert(result.message || 'Erreur lors de la prise de rendez-vous');
            }

        } catch (error) {
            console.error('Erreur réseau ou serveur:', error);
            alert('Erreur lors de la communication avec le serveur');
        }
    });
}


async function loadAppointments(doctorId) {
    try {
        const response = await fetch(`/info2/site/calendrier/get-data.php?action=getRdvsByDoctor&id_medecin=${doctorId}`);
        const appointments = await response.json();
        // displayAppointments(appointments);
    } catch (error) {
        console.error('Erreur en chargeant les RDV:', error);
    }
}
