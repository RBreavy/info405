function envoiMail(){
    let param = {
        name : "test",
        email : document.getElementById("mail-recup").value ,
        subject : "réinitialiser votre mot de passe",
        message : "voici votre code à entrer: 777"
    }

    emailjs.send("service_info405","template_1wicn1k", param).then(alert("Mail envoyé !!"));
}
