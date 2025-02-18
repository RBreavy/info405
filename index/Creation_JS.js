document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const form = document.querySelector("form");
    const nomInput = document.getElementById("nom");
    const mailInput = document.getElementById("mail");
    const mdpInput = document.getElementById("mdp");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Empêcher la soumission classique

            // Récupération des valeurs
            const nom = nomInput.value;
            const mail = mailInput.value;
            const mdp = mdpInput.value;

            // Vérifications de base
            if (!nomInput || !mailInput || !mdpInput) {
                showError("Tous les champs doivent être remplis.");
                return;
            }

            // Création de FormData
            const formData = new FormData();
            formData.append("nom", nom);
            formData.append("mail", mail);
            formData.append("mdp", mdp);

            // Envoi de la requête
            fetch("SignUp.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "patient.html"; // Redirection après succès
                } else {
                    showError(data.message || "Une erreur est survenue.");
                }
            })
            .catch(error => {
                console.error("Erreur de connexion:", error);
                showError("Impossible de contacter le serveur. Réessayez plus tard.");
            });
        });
    }

    // Fonction d'affichage des erreurs
    function showError(message) {
        if (errorContainer) {
            errorContainer.innerText = message;
            errorContainer.style.color = "red";
        }
    }
});
