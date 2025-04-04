function envoiMail(){
    event.preventDefault();

    let param = {
        name : "test",
        email : document.getElementById("mail-recup").value ,
        subject : "réinitialiser votre mot de passe",
        message : "voici votre code à entrer: 777"
    }

    emailjs.send("service_info405", "template_1wicn1k", param)
        .then(function(response) {
            console.log("Mail envoyé !!", response);
            alert("Un e-mail a été envoyé à " + param.from_email + " avec les instructions pour réinitialiser votre mot de passe.");
        }, function(error) {
            console.log("Erreur lors de l'envoi du mail", error);
            alert("Une erreur est survenue, veuillez réessayer.");
        }); 
}
