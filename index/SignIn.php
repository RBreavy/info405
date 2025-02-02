<?php
session_start();
require_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nom = $_POST['nom'];
    $password = $_POST['psw'];

    if (empty($nom) || empty($password)) {
        die("Veuillez remplir tous les champs.");
    }

    // récuperer dans la base de donnée de manière sécurisée
    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE nom = :nom");
    $stmt->bindParam(':nom', $nom);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['mot_de_passe'])) {
        $_SESSION['nom'] = $user['nom'];
        echo "Connexion réussie";
        header("Location: ../patient.html");
        exit();
    
    } else {
        echo "Nom ou mot de passe incorrect.";
    }
} else {
    echo "Accès non autorisé.";
}
?>