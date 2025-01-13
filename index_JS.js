/* pour chaque personne il faut :
- nom
- mail
- mdp
(boolean admin a revoir)
*/

// pour la page mdp_oublié
const mailBtn = document.getElementById("mail-btn");
if (mailBtn) {
    mailBtn.addEventListener("click", function(event) {
        event.preventDefault();
        
        const mailRecup = document.getElementById("mail-recup").value;
        console.log("Mail pour réinitialisation :", mailRecup);
    });
};

// sauvegarde local si se souvenir est coché
document.addEventListener("DOMContentLoaded", function () {
    const savedName = localStorage.getItem("nom");
    const savedMail = localStorage.getItem("mail");
    const savedsouvenir = localStorage.getItem("souvenir");

    if (savedsouvenir === "true") {
        document.getElementById("nom").value = savedName || "";
        document.getElementById("mail").value = savedMail || "";
        document.getElementById("souvenir").checked = true;
    }

    // Gérer le clic sur le bouton de connexion
    document.getElementById("submit-btn").addEventListener("click", function (event) {
        event.preventDefault();

        const nom = document.getElementById("nom").value;
        const mail = document.getElementById("mail").value;
        const souvenir = document.getElementById("souvenir").checked;

        if (souvenir) {
            //sauvegarde dans la mémoire
            localStorage.setItem("nom", nom);
            localStorage.setItem("mail", mail);
            localStorage.setItem("souvenir", true);
        } else {
            //supprime de la mémoire si on décoche
            localStorage.removeItem("nom");
            localStorage.removeItem("mail");
            localStorage.setItem("souvenir", false);
        }

        // test dans la console
        console.log("Nom :", nom);
        console.log("Mail :", mail);
        console.log("Se souvenir de moi :", souvenir);
    });
});

