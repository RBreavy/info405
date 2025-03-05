<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "db_connect.php"; // Connexion à la base de données

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Récupérer les valeurs du formulaire
    $nom = trim($_POST['nom']);
    $password = trim($_POST['psw']);

    // Vérification que les champs ne sont pas vides
    if (empty($nom) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs.']);
        exit;
    }

    // Requête pour chercher l'utilisateur avec le nom spécifié
    $stmt = $conn->prepare("SELECT * FROM utilisateurs WHERE nom = ?");
    $stmt->bind_param('s', $nom);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Vérifier le mot de passe avec password_verify() (pour mots de passe hashés)
        if (password_verify($password, $user['mot_de_passe'])) {
            // Démarrer la session
            $_SESSION['nom'] = $user['nom'];
            $_SESSION['mail'] = $user['email']; // Si tu veux stocker l'email aussi
            echo json_encode(['success' => true, 'message' => 'Connexion réussie.']);
            header("Location: ../patient.html");
            exit();
        } else {
            echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Utilisateur non trouvé.']);
    }

    $stmt->close();
    $conn->close();
}
?>
