<?php
session_start();
require_once "db_connect.php"; // This will now use mysqli

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nom = $_POST['nom'];
    $password = $_POST['psw'];

    if (empty($nom) || empty($password)) {
        die("Veuillez remplir tous les champs.");
    }

    // Using mysqli to prepare and execute the query
    $stmt = $conn->prepare("SELECT * FROM utilisateurs WHERE nom = ?");
    $stmt->bind_param('s', $nom); // 's' means string type
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        echo "<pre>";
        print_r($user); // Affiche les données de l'utilisateur récupérées
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
?>
