document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const nomInput = document.getElementById("nom");
    const mailInput = document.getElementById("mail");
    const mdpInput = document.getElementById("mdp");

    if (!nomInput || !mailInput || !mdpInput) {
        console.error("Un ou plusieurs champs du formulaire sont introuvables !");
        return;
    }

    if (form) {
        form.addEventListener("submit", function (event) {
        event.preventDefault(); // Empêche l'envoi classique

        const nom = nomInput.value.trim();
        const mail = mailInput.value.trim();
        const mdp = mdpInput.value.trim();

        // Vérifications simples côté client
        if (nom === "" || mail === "" || mdp === "") {
            alert("Tous les champs doivent être remplis.");
            return;
        }

        // Envoi AJAX avec fetch
        fetch("SignUp.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `nom=${encodeURIComponent(nom)}&mail=${encodeURIComponent(mail)}&mdp=${encodeURIComponent(mdp)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirige manuellement si succès
                window.location.href = "../PHP/patient.php";
            } else {
                alert(data.message); // Affiche le message d’erreur PHP
            }
        })
        .catch(error => {
            console.error("Erreur réseau :", error);
            alert("Une erreur est survenue lors de l’envoi du formulaire.");
        });
    });

    }
});