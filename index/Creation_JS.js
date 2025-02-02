document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-btn");

    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();

            const nom = document.getElementById("nom").value;
            const mail = document.getElementById("mail").value;
            const mdp = document.getElementById("psw").value;

            // Crée un objet FormData pour envoyer les données du formulaire
            const formData = new FormData();
            formData.append('nom', nom);
            formData.append('mail', mail);
            formData.append('mdp', mdp);

            // Envoie la requête POST au serveur
            fetch('SignUp.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Inscription réussie !");
                    window.location.href = "patient.html"; 
                } else {
                    alert("Erreur : " + data.message);
                }
            })
            .catch(error => {
                console.error("Erreur de connexion:", error);
                alert("Une erreur s'est produite. Essayez à nouveau.");
            });
        });
    }
});
