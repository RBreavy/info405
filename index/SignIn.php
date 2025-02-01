<?php
session_start();
include "db_connect.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nom = trim($_POST['nom']);
    $password = trim($_POST['psw']);

    // Vérifier que les champs ne sont pas vides
    if (empty($nom) || empty($password)) {
        echo "<script>alert('Veuillez remplir tous les champs.'); window.history.back();</script>";
        exit();
    }

    // Préparer la requête SQL sécurisée
    $stmt = $conn->prepare("SELECT id_utilisateurs, nom, mot_de_passe FROM utilisateurs WHERE nom = ?");
    $stmt->bind_param("s", $nom);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($id, $nom, $hashed_password);
        $stmt->fetch();

        // Vérifier le mot de passe
        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $id;
            $_SESSION['user_name'] = $nom;
            header("Location: ../patient.html");
            exit();
        }
    }
    echo "<script>alert('Nom ou mot de passe incorrect.'); window.history.back();</script>";
    
    $stmt->close();
    $conn->close();
}
?>
