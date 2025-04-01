function envoiMail() {
    let email = document.getElementById("mail-recup").value;

    fetch("mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error("Erreur :", error));
}
