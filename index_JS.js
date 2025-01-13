/* pour chaque personne il faut :
- nom
- mail
- mdp
(boolean admin a revoir)
*/
const submitBtn = document.getElementById("submit-btn");
if (submitBtn) {
    submitBtn.addEventListener("click", function(event) {
        event.preventDefault();
        
        const nom = document.getElementById("nom").value;
        const mail = document.getElementById("mail").value;
        const motDePasse = document.getElementById("psw").value;
        const seSouvenir = document.getElementById("remember").checked;

        console.log("Nom :", nom);
        console.log("Mail :", mail);
        console.log("Mot de passe :", motDePasse);
        console.log("Se souvenir de moi :", seSouvenir);
    });
}

const mailBtn = document.getElementById("mail-btn");
if (mailBtn) {
    mailBtn.addEventListener("click", function(event) {
        event.preventDefault();
        
        const mailRecup = document.getElementById("mail-recup").value;
        console.log("Mail pour réinitialisation :", mailRecup);
    });
}
