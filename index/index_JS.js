document.addEventListener("DOMContentLoaded", function () {
    // Récupérer les valeurs sauvegardées dans le localStorage
    const savedName = localStorage.getItem("nom");
    const savedPsw = localStorage.getItem("psw");
    const savedSouvenir = localStorage.getItem("souvenir");

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
        souvenirCheckbox.checked = savedSouvenir === "true"; 
    }

    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const nom = nomInput ? nomInput.value : "";
            const psw = pswInput ? pswInput.value : "";
            const souvenir = souvenirCheckbox ? souvenirCheckbox.checked : false;

            if (souvenir) {
                localStorage.setItem("nom", nom);
                localStorage.setItem("psw", psw);
                localStorage.setItem("souvenir", "true");
            } else {
                localStorage.removeItem("nom");
                localStorage.removeItem("psw");
                localStorage.setItem("souvenir", "false");
            }

            form.submit();
        });
    }
});
