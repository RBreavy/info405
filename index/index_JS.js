document.addEventListener("DOMContentLoaded", function () {
    // Récupérer les valeurs sauvegardées dans le localStorage
    const savedName = localStorage.getItem("nom");
    const savedPsw = localStorage.getItem("psw");
    const savedSouvenir = localStorage.getItem("souvenir");

    const nomInput = document.getElementById("nom");
    const pswInput = document.getElementById("psw");
    const souvenirCheckbox = document.getElementById("souvenir");
    const form = document.querySelector("form");

    if (nomInput) nomInput.value = savedName || "";
    if (pswInput) pswInput.value = savedPsw || "";
    if (souvenirCheckbox) souvenirCheckbox.checked = savedSouvenir === "true";

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const nom = nomInput ? nomInput.value.trim() : "";
            const psw = pswInput ? pswInput.value.trim() : "";
            const souvenir = souvenirCheckbox ? souvenirCheckbox.checked : false;

            if (nom === "" || psw === "") {
                alert("Tous les champs sont requis.");
                return;
            }

            if (souvenir) {
                localStorage.setItem("nom", nom);
                localStorage.setItem("psw", psw);
                localStorage.setItem("souvenir", "true");
            } else {
                localStorage.removeItem("nom");
                localStorage.removeItem("psw");
                localStorage.setItem("souvenir", "false");
            }

            // Envoi AJAX avec fetch
            fetch("../index/SignIn.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `nom=${encodeURIComponent(nom)}&psw=${encodeURIComponent(psw)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error("Erreur réseau :", error);
                alert("Une erreur est survenue lors de la connexion.");
            });
        });
    }
});
