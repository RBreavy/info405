/* pour chaque personne il faut :
- nom
- mail
- mdp
(boolean admin a revoir)
*/


document.addEventListener("DOMContentLoaded", function () {
    const savedName = localStorage.getItem("nom");
    const savedMail = localStorage.getItem("mail");
    const savedsouvenir = localStorage.getItem("souvenir");

    const nomInput = document.getElementById("nom");
    if (nomInput) {
        nomInput.value = savedName || "";
    }

    const mailInput = document.getElementById("mail");
    if (mailInput) {
        mailInput.value = savedMail || "";
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
            const mail = mailInput ? mailInput.value : "";
            const souvenir = souvenirCheckbox ? souvenirCheckbox.checked : false;

            if (souvenir) {
                localStorage.setItem("nom", nom);
                localStorage.setItem("mail", mail);
                localStorage.setItem("souvenir", true);
            } else {
                localStorage.removeItem("nom");
                localStorage.removeItem("mail");
                localStorage.setItem("souvenir", false);
            }

            console.log("Nom :", nom);
            console.log("Mail :", mail);
            console.log("Se souvenir de moi :", souvenir);
        });
    }
});
