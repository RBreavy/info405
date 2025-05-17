document.addEventListener("DOMContentLoaded", function () {
    const nomInput = document.getElementById("nom");
    const pswInput = document.getElementById("psw");
    const souvenirCheckbox = document.getElementById("souvenir");
    const form = document.getElementById("login-form");

    if (nomInput && localStorage.getItem("souvenir") === "true") {
        nomInput.value = localStorage.getItem("nom") || "";
    }
    
    if (souvenirCheckbox) {
        souvenirCheckbox.checked = localStorage.getItem("souvenir") === "true";
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const nom = nomInput.value.trim();
            const psw = pswInput.value.trim();
            const souvenir = souvenirCheckbox.checked;

            if (!nom || !psw) {
                alert("Tous les champs sont requis.");
                return;
            }

            if (souvenir) {
                localStorage.setItem("nom", nom);
                localStorage.setItem("souvenir", "true");
            } else {
                localStorage.removeItem("nom");
                localStorage.setItem("souvenir", "false");
            }
            const formData = new FormData();
            formData.append("nom", nom);
            formData.append("psw", psw);
            formData.append("csrf_token", "<?php echo generateCSRFToken(); ?>");

            fetch("../PHP/SignIn.php", {
                method: "POST",
                body: formData,
                credentials: 'same-origin'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur réseau: " + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error("Erreur: ", error);
                alert("Une erreur est survenue lors de la connexion.");
            });
        });
    }
});