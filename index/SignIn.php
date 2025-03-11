<?php
session_start();
require_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Utilisation de htmlspecialchars pour éviter les attaques XSS
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
        // Comparaison directe des mots de passe (temporaire, à remplacer par password_verify)
        if ($password === $user['mot_de_passe']) {
            $_SESSION['nom'] = $user['nom'];
            $_SESSION['user_id'] = $user['id']; // Stockez l'ID utilisateur si disponible
            $_SESSION['user_type'] = 'patient';
            
            // Utiliser un jeton de session pour éviter la fixation de session
            session_regenerate_id(true);
            
            header("Location: ../patient.html?nom=" . urlencode($user['nom']));
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
        // Comparaison directe des mots de passe (temporaire, à remplacer par password_verify)
        if ($password === $medecin['mot_de_passe']) {
            $_SESSION['nom'] = $medecin['nom'];
            $_SESSION['user_id'] = $medecin['id']; // Stockez l'ID médecin si disponible
            $_SESSION['user_type'] = 'medecin';
            
            // Utiliser un jeton de session pour éviter la fixation de session
            session_regenerate_id(true);
            
            header("Location: ../Vue_docteur.html?nom=" . urlencode($medecin['nom']));
            exit();
        }
    }

    // Message d'erreur générique pour ne pas indiquer si l'utilisateur existe
    echo "Nom d'utilisateur ou mot de passe incorrect.";
    $conn->close();
}
?>