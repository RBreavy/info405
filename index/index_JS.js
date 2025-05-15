document.addEventListener("DOMContentLoaded", function () {
    const nomInput = document.getElementById("nom");
    const pswInput = document.getElementById("psw");
    const souvenirCheckbox = document.getElementById("souvenir");
    const form = document.getElementById("login-form");

    // Remplissage des champs avec localStorage
    if (nomInput) nomInput.value = localStorage.getItem("nom") || "";
    if (pswInput) pswInput.value = localStorage.getItem("psw") || "";
    if (souvenirCheckbox) souvenirCheckbox.checked = localStorage.getItem("souvenir") === "true";

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Empêche la soumission classique

            const nom = nomInput.value.trim();
            const psw = pswInput.value.trim();
            const souvenir = souvenirCheckbox.checked;

            if (!nom || !psw) {
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

            // Envoi AJAX
            fetch("../index/SignIn.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `nom=${encodeURIComponent(nom)}&psw=${encodeURIComponent(psw)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect; // Redirection manuelle
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
