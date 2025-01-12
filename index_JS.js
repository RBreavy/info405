/* pour chaque personne il faut :
- nom
- mail
- mdp
*/

document.getElementById("submit-btn").addEventListener("click", function(event) {

    event.preventDefault();
    
    const nom = document.getElementById("nom").value;
    const mail = document.getElementById("mail").value;
    const motDePasse = document.getElementById("psw").value;
    const seSouvenir = document.getElementById("remember").checked;

    // test affichage dans la console
    console.log("Nom :", nom);
    console.log("Mail :", mail);
    console.log("Mot de passe :", motDePasse);
    console.log("Se souvenir de moi :", seSouvenir);
});