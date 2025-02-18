document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
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
            event.preventDefault(); // Empêcher la soumission classique

            const nom = nomInput.value.trim();
            const mail = mailInput.value.trim();
            const mdp = mdpInput.value.trim();

            // Vérifications de base
            if (nom === "" || mail === "" || mdp === "") {
                alert("Tous les champs doivent être remplis.");
                return;
            }

            localStorage.setItem("nom", nom);
            localStorage.setItem("mail", mail);
            localStorage.setItem("mdp", mdp);

            form.submit();
        });
    }
});
