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

            const nom = nomInput.value;
            const mail = mailInput.value;
            const mdp = mdpInput.value;

            // Vérifications de base
            if (nom === "" || mail === "" || mdp === "") {
                alert("Tous les champs doivent être remplis.");
                return;
            }

            console.log("Nom:", nomInput, "Valeur:", nomInput.value);
            console.log("Mail:", mailInput, "Valeur:", mailInput.value);
            console.log("Mot de passe:", mdpInput, "Valeur:", mdpInput.value);

            form.submit();
        });
    }
});
