/* pour chaque personne il faut :
- nom
- mail
- mdp
(boolean admin a revoir)
*/


document.addEventListener("DOMContentLoaded", function () {     // utilisation du local storage pour sauvegarder les informations
    const savedName = localStorage.getItem("nom");
    const savedPsw = localStorage.getItem("psw");
    const savedsouvenir = localStorage.getItem("souvenir");

    const nomInput = document.getElementById("nom");
    if (nomInput) {
        nomInput.value = savedName || "";
    }

    const pswInput = document.getElementById("psw");
    if (pswInput) {
        pswInput.value = savedPsw || "";
    }

    const souvenirCheckbox = document.getElementById("souvenir");
    if (souvenirCheckbox) {
        souvenirCheckbox.checked = savedsouvenir === "true";
    }

    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
        submitBtn.addEventListener("click", function (event) {
            event.preventDefault();

            const nom = nomInput ? nomInput.value : "";
            const psw = pswInput ? pswInput.value : "";
            const souvenir = souvenirCheckbox ? souvenirCheckbox.checked : false;

            if (souvenir) {
                localStorage.setItem("nom", nom);
                localStorage.setItem("psw", psw);
                localStorage.setItem("souvenir", true);
            } else {
                localStorage.removeItem("nom");
                localStorage.removeItem("psw");
                localStorage.setItem("souvenir", false);
            }

            console.log("Nom :", nom);
            console.log("Mot de passe :", psw);
            console.log("Se souvenir de moi :", souvenir);
        });
    }
});