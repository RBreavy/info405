<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    
    // Débogage : Vérifie les données reçues
    error_log("Données POST reçues : " . print_r($_POST, true));

    // Vérifie si l'email est valide
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $to = $email;
        $subject = "Réinitialisation de votre mot de passe";
        $message = "Pour récupérer votre mot de passe, cliquez sur ce lien : blabla";
        $headers = "From: info405mailrecup@gmail.com\r\n" .
                   "Reply-To: info405mailrecup@gmail.com\r\n" .
                   "Content-Type: text/plain; charset=UTF-8";

        // Débogage : Vérifie si la fonction mail() est bien appelée
        error_log("Tentative d'envoi du mail à : " . $to); 

        if (mail($to, $subject, $message, $headers)) {
            error_log("E-mail envoyé avec succès à : " . $to);
            echo json_encode(["success" => true, "message" => "E-mail envoyé avec succès à $email"]);
        } else {
            error_log("Erreur lors de l'envoi de l'email à : " . $to);
            echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi du mail."]);
        }
    } else {
        error_log("L'email est invalide : " . $email); // Message si l'email est invalide
        echo json_encode(["success" => false, "message" => "L'email est invalide."]);
    }
}
?>
