<?php
session_start();
require_once "db_connect.php"; // Connexion à la base de données

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nom = $_POST['nom'];
    $password = $_POST['psw'];

    if (empty($nom) || empty($password)) {
        die("Veuillez remplir tous les champs.");
    }

    // Vérification dans la table utilisateurs
    $stmt = $conn->prepare("SELECT * FROM utilisateurs WHERE nom = ?");
    $stmt->bind_param('s', $nom);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && $password === $user['mot_de_passe']) {
        $_SESSION['nom'] = $user['nom'];
        $_SESSION['role'] = 'utilisateur';
        header("Location: ../patient.html");
        exit();
    }

    // Vérification dans la table médecins
    $stmt = $conn->prepare("SELECT * FROM medecins WHERE nom = ?");
    $stmt->bind_param('s', $nom);
    $stmt->execute();
    $result = $stmt->get_result();
    $medecin = $result->fetch_assoc();

    if ($medecin && $password === $medecin['mot_de_passe']) {
        $_SESSION['nom'] = $medecin['nom'];
        $_SESSION['role'] = 'medecin';
        header("Location: ../medecin.html");
        exit();
    }

    // Si ni utilisateur ni médecin trouvé
    echo "Nom d'utilisateur ou mot de passe incorrect.";

    $stmt->close();
    $conn->close();
}
?>
