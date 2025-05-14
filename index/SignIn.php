<?php
session_start();
require_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // attaque XSS
    $nom = htmlspecialchars(trim($_POST['nom']), ENT_QUOTES, 'UTF-8');
    $password = trim($_POST['psw']);

    if (empty($nom) || empty($password)) {
        die("Veuillez remplir tous les champs.");
    }

    // Vérification dans la table utilisateurs avec prepared statements
    $stmt = $conn->prepare("SELECT * FROM utilisateurs WHERE nom = ?");
    if (!$stmt) {
        die("Erreur de préparation de requête: " . $conn->error);
    }

    $stmt->bind_param('s', $nom);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if ($user) {
        if ($password === $user['mot_de_passe']) {
            $_SESSION['nom'] = $user['nom'];
            $_SESSION['user_id'] = $user['id_utilisateurs'];
            $_SESSION['user_type'] = 'patient';

            // Régénération de l'ID de session pour éviter la fixation de session
            session_regenerate_id(true);

            header("Location: ../patient.php");
            exit();
        }
    }

    // Vérification dans la table médecins avec prepared statements
    $stmt = $conn->prepare("SELECT * FROM medecin WHERE nom = ?");
    if (!$stmt) {
        die("Erreur de préparation de requête: " . $conn->error);
    }

    $stmt->bind_param('s', $nom);
    $stmt->execute();
    $result = $stmt->get_result();
    $medecin = $result->fetch_assoc();
    $stmt->close();

    if ($medecin) {
        if ($password === $medecin['mot_de_passe']) {
            $_SESSION['user_id'] = $medecin['id_medecin'];
            $_SESSION['nom'] = $medecin['nom'];
            $_SESSION['user_type'] = 'medecin';

            session_regenerate_id(true);

            header("Location: ../Vue_docteur.php");
            exit();
        }
    }

    echo "Nom d'utilisateur ou mot de passe incorrect.";
    $conn->close();
}
?>