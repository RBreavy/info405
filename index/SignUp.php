<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!empty($_POST['nom']) && !empty($_POST['mail']) && !empty($_POST['mdp'])) {
        $nom = trim($_POST['nom']);
        $mail = trim($_POST['mail']);
        $mdp = trim($_POST['mdp']);

        // Vérifier que l'email est valide
        if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Email invalide']);
            exit;
        }

        // Vérification du mot de passe
        if (strlen($mdp) < 6) {
            echo json_encode(['success' => false, 'message' => 'Le mot de passe doit comporter au moins 6 caractères']);
            exit;
        }

        // Requête préparée
        $stmt = $conn->prepare("INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nom, $mail, $mdp);

        if ($stmt->execute()) {
            // Pas d'output avant la redirection
            header("Location: ../patient.html");
            exit();
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de l’insertion : ' . $stmt->error]);
        }
        
        $stmt->close();
        $conn->close();

    } else {
        echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    }

}
?>
