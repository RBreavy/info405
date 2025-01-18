document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-btn");

    if (submitButton) {

        submitButton.addEventListener("click", function (event) {
            
            const nom = document.getElementById("nom").value;
            const mail = document.getElementById("mail").value;
            const mdp = document.getElementById("psw").value;

            
            console.log("Nom:", nom);
            console.log("Mail:", mail);
            console.log("Mot de passe:", mdp);
        });
    };
});
