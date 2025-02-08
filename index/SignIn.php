<?php
session_start();
require_once "db_connect.php"; // Assurez-vous que db_connect.php est correct et retourne $conn

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nom = $_POST['nom'];
    $password = $_POST['psw'];

    if (empty($nom) || empty($password)) {
        die("Veuillez remplir tous les champs.");
    }

    // Utilisation de mysqli pour préparer et exécuter la requête
    $stmt = $conn->prepare("SELECT * FROM utilisateurs WHERE nom = ?");
    $stmt->bind_param('s', $nom); // 's' pour type string
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Affiche les données de l'utilisateur récupérées pour déboguer
        echo "<pre>";
        print_r($user); 
        echo "</pre>";

        if (password_verify($password, $user['mot_de_passe'])) {
            $_SESSION['nom'] = $user['nom'];
            echo "Connexion réussie";
            header("Location: ../patient.html");
            exit();
        } else {
            echo "Nom ou mot de passe incorrect.";
        }
    } else {
        echo "Utilisateur non trouvé.";
    }
} else {
    echo "Accès non autorisé.";
}
?>
