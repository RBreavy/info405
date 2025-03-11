<?php
session_start();
require_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = trim($_POST['nom']);
    $password = trim($_POST['psw']);

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
        header("Location: ../patient.html?nom=" . urlencode($user['nom']));
        exit();
    }

    // Vérification dans la table médecins
    $stmt = $conn->prepare("SELECT * FROM medecin WHERE nom = ?");
    $stmt->bind_param('s', $nom);
    $stmt->execute();
    $result = $stmt->get_result();
    $medecin = $result->fetch_assoc();

    if ($medecin && $password === $medecin['mot_de_passe']) {
        $_SESSION['nom'] = $medecin['nom'];
        header("Location: ../Vue_docteur.html?nom=" . urlencode($medecin['nom']));
        exit();
    }

    echo "Nom d'utilisateur ou mot de passe incorrect.";
    $stmt->close();
    $conn->close();
}
?>