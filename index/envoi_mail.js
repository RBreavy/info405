function envoiMail() {
    let email = document.getElementById("mail-recup").value;

    console.log("Envoi de l'email à : " + email); // Message de suivi

    fetch("mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: email })
    })
    .then(response => {
        console.log("Réponse du serveur reçue.");
        return response.json(); // Transforme la réponse en JSON
    })
    .then(data => {
        if (data.success) {
            console.log("E-mail envoyé avec succès."); // Message de succès
            alert(data.message);
        } else {
            console.error("Erreur d'envoi de l'email : " + data.message); // Message d'erreur
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête : ", error); // Erreur de requête
