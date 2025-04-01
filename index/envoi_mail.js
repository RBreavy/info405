document.getElementById("reset-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    let email = document.getElementById("mail-recup").value;
    let messageDiv = document.getElementById("message");

    console.log("📨 Tentative d'envoi de l'email à : " + email);

    fetch("mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Réponse du serveur : ", data);
        messageDiv.textContent = data.message;
        messageDiv.style.color = data.success ? "green" : "red";
    })
    .catch(error => {
        console.error("❌ Erreur lors de la requête :", error);
        messageDiv.textContent = "❌ Une erreur est survenue.";
        messageDiv.style.color = "red";
    });
});
