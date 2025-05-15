let selectedDoctorId = null;
let selectedDoctorName = null;

document.addEventListener('DOMContentLoaded', () => {
    loadDoctors();
    setupEventListeners();
});

async function loadDoctors() {
    try {
        const response = await fetch('/info2/site/PHP/get-data.php?action=doctors');
        const doctors = await response.json();
        displayDoctors(doctors);
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de charger la liste des médecins');
    }
}

window.addEventListener('weekChanged', () => {
    if (selectedDoctorId != -1) {
        loadAppointments(selectedDoctorId);
    }
});

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
        selectedDoctorId = null;
        selectedDoctorName = null;
        window.cal_maj_rdv();
        window.cal_chargerEtAfficherRDV();
    });

    window.addEventListener('clickedEvent', (event) => {
        const id = event.detail.id;
        const dateStr = id.substring(0,10);
        const idArticle = parseInt(id.substring(10));
        
        const dateParts = dateStr.split('/');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        const totalMinutes = idArticle * 10;
        const hours = Math.floor(totalMinutes / 60) + 8;
        const minutes = totalMinutes % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        document.getElementById('rdv-date').value = formattedDate;
        document.getElementById('rdv-time').value = formattedTime;
    });

    document.getElementById('rdv-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const date = document.getElementById('rdv-date').value;
        const time = document.getElementById('rdv-time').value;
        const duration = parseInt(document.getElementById('rdv-duration').value);
        const couleur = (duration == 10) ? "palegreen" : (duration == 20) ? "orangered" : "paleturquoise";

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
            id_utilisateur: id,
            couleur: couleur,
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
                const jourStr = startDateTime.toLocaleDateString("fr-FR");
                const h_debut = (startDateTime.getHours() - 8) * 6 + Math.floor(startDateTime.getMinutes() / 10);
                const h_fin = (endDateTime.getHours() - 8) * 6 + Math.floor(endDateTime.getMinutes() / 10) - 1;
            
                setTimeout(() => {
                    cal_create_rdv(h_debut, h_fin, jourStr, jourStr, couleur, selectedDoctorId, false, false);
                }, 50);
            } else {
                alert(result.message || 'Erreur lors de la prise de rendez-vous');
            }

        } catch (error) {
            console.error('Erreur réseau ou serveur:', error);
            alert('Erreur lors de la communication avec le serveur');
        }
    });
}


function displayI(IndT,IndR) {
    const dateDebutSemaine = new Date(date);
    dateDebutSemaine.setDate(date.getDate() + offsetjour + 1 - indice_jour);
    
    
    const dateFinSemaine = new Date(dateDebutSemaine);
    dateFinSemaine.setDate(dateDebutSemaine.getDate() + 6);
    dateFinSemaine.setHours(23, 59, 59);

    for (const IR of IndR) {
        const journee = IR.journee;
        const h_debut = (IR.heure_debut.slice(0,2) - 8) * 6 + Math.floor(IR.heure_debut.slice(3,5) / 10);
        const h_fin = (IR.heure_fin.slice(0,2) - 8) * 6 + Math.floor(IR.heure_fin.slice(3,5) / 10) - 1;
        const dateDebutSemaine = new Date(date);
        dateDebutSemaine.setDate(date.getDate() + offsetjour + 1 - indice_jour);

        const jourtoindice = new Map([
            ["LUN",0],
            ["MAR",1],
            ["MER",2],
            ["JEU",3],
            ["VEN",4],
            ["SAM",5],
            ["DIM",6],
        ]);
        const indice = jourtoindice.get(journee);
        const jour = new Date(dateDebutSemaine);
        jour.setDate(dateDebutSemaine.getDate() + indice);
        const jourStr = jour.toLocaleDateString("fr-FR");
        setTimeout(() => {
            window.cal_create_rdv(h_debut, h_fin, jourStr, jourStr, "darkgrey","",false,true);
        }, 50);
    }

    for (const IT of IndT) {
        const debutIndisp = new Date(IT.debut_periode.replace(' ', 'T'));
        const finIndisp = new Date(IT.fin_periode.replace(' ', 'T'));
        
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
                    window.cal_create_rdv(h_debut, h_fin, jourStr, jourStr, "lightgrey","",false,true);
                }, 50);
                
                // Passer au jour suivant
                const nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + 1);
                currentDate = nextDate;
            }
        }
    } 


}

async function displayAppointments(appointments) {
    const dateDebutSemaine = new Date(date);
    dateDebutSemaine.setDate(date.getDate() + offsetjour + 1 - indice_jour);
    
    
    const dateFinSemaine = new Date(dateDebutSemaine);
    dateFinSemaine.setDate(dateDebutSemaine.getDate() + 6);
    dateFinSemaine.setHours(23, 59, 59);
    
    for (const rdv of appointments) {
        const yourdv = await fetch(`/info2/site/PHP/get-data.php?action=rdvOwnByUser&id_rdv=${rdv.id}&id_patient=${id}`);
        const You_RDV = await yourdv.json();
        if (!You_RDV) {
            
            const debut = new Date(rdv.date_debut.replace(' ', 'T'));
            const fin = new Date(rdv.date_fin.replace(' ', 'T'));
        

            if ((debut >= dateDebutSemaine && debut <= dateFinSemaine) ||
                (fin >= dateDebutSemaine && fin <= dateFinSemaine) ||
                (debut <= dateDebutSemaine && fin >= dateFinSemaine)) {

                const jourStr = debut.toLocaleDateString("fr-FR");
                const h_debut = (debut.getHours() - 8) * 6 + Math.floor(debut.getMinutes() / 10);
                const h_fin = (fin.getHours() - 8) * 6 + Math.floor(fin.getMinutes() / 10) - 1;

                //const couleurRdv = estDoc ? couleur : "grey";

                setTimeout(() => {
                    console.log(h_debut, h_fin, jourStr);
                    cal_create_rdv(h_debut, h_fin, jourStr, jourStr, "grey", "", false,true);
                }, 50);

            }
        }
    }
}

async function loadAppointments(doctorId) {
    try {
        const rdv = await fetch(`/info2/site/PHP/get-data.php?action=getRdvsByDoctor&id_medecin=${doctorId}`);
        const appointments = await rdv.json();
        displayAppointments(appointments);

        const indep_t = await fetch(`/info2/site/PHP/get-data.php?action=getIT&id_medecin=${doctorId}`);
        const indt = await indep_t.json();

        const indep_r = await fetch(`/info2/site/PHP/get-data.php?action=getIR&id_medecin=${doctorId}`);
        const indr = await indep_r.json();
        displayI(indt,indr);

        
        displayAppointments(appointments);
    } catch (error) {
        console.error('Erreur en chargeant les RDV:', error);
    }
}

// Menu functionality
function openNav() {
    document.getElementById("mySidenav").style.left = "0";
}

function closeNav() {
    document.getElementById("mySidenav").style.left = "-250px";
}

