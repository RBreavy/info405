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
            // Stockage des informations de l'utilisateur dans la session
            $_SESSION['nom'] = $user['nom'];
            $_SESSION['user_id'] = $user['id_utilisateurs'];
            $_SESSION['user_type'] = 'patient';
            
            // Régénération de l'ID de session pour éviter la fixation de session
            session_regenerate_id(true);
            
            // Redirection sans exposer le nom dans l'URL
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
        // Comparaison directe des mots de passe (temporaire, à remplacer par password_verify)
        if ($password === $medecin['mot_de_passe']) {
            // Stockage des informations du médecin dans la session
            $_SESSION['user_id'] = $medecin['id_medecin'];
            $_SESSION['nom'] = $medecin['nom'];
            $_SESSION['user_type'] = 'medecin';
            
            // Régénération de l'ID de session pour éviter la fixation de session
            session_regenerate_id(true);
            
            // Redirection sans exposer le nom dans l'URL
            header("Location: ..Vue_docteur.php");
            exit();
        }
    }

    // Message d'erreur générique pour ne pas indiquer si l'utilisateur existe
    echo "Nom d'utilisateur ou mot de passe incorrect.";
    $conn->close();
}
?>