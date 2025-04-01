<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    
    // Vérifie si l'email est valide
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $to = $email;
        $subject = "Réinitialisation de votre mot de passe";
        $message = "Pour récupérer votre mot de passe, cliquez sur ce lien : blabla";
        $headers = "From: info405mailrecup@gmail.com\r\n" .
                   "Reply-To: contact@tondomaine.com\r\n" .
                   "Content-Type: text/plain; charset=UTF-8";

        // Envoi de l'email
        if (mail($to, $subject, $message, $headers)) {
            echo json_encode(["success" => true, "message" => "E-mail envoyé avec succès à $email"]);
        } else {
            echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi du mail."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "L'email est invalide."]);
    }
}
?>
