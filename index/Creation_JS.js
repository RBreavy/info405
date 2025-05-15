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
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // Empêche la soumission classique

            const nom = nomInput.value.trim();
            const mail = mailInput.value.trim();
            const mdp = mdpInput.value.trim();

            if (nom === "" || mail === "" || mdp === "") {
                alert("Tous les champs doivent être remplis.");
                return;
            }

            const formData = new FormData();
            formData.append("nom", nom);
            formData.append("mail", mail);
            formData.append("mdp", mdp);

            try {
                const response = await fetch("SignUp.php", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Redirection si tout s’est bien passé
                    window.location.href = "../patient.php";
                } else {
                    // Affiche une alerte avec le message d’erreur PHP
                    alert(data.message);
                }
            } catch (error) {
                alert("Une erreur est survenue lors de l’inscription.");
                console.error(error);
            }
        });
    }
});