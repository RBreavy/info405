<?php
session_start(); // Démarrer la session
include "db_connect.php"; // Connexion à la base de données

if (!$conn) {
    die("Erreur de connexion: " . mysqli_connect_error());
}

// Méthode POST 
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $mail = trim($_POST['mail']);
    $password = trim($_POST['password']);

    // Si les 2 champs ne sont pas remplis
    if (empty($mail) || empty($password)) {
        echo "<script>alert('Veuillez remplir tous les champs.'); window.history.back();</script>";
        exit();
    }

    // Rechercher l'utilisateur dans la base de données
    $stmt = $conn->prepare("SELECT id, nom, mot_de_passe FROM utilisateurs WHERE email = ?");
    $stmt->bind_param("s", $mail);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Vérification du mot de passe
        if (password_verify($password, $user['mot_de_passe'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nom'];
            echo "<script>window.location.href='../patient.html';</script>";
            exit();
        } else {
            echo "<script>alert('Mot de passe incorrect.'); window.history.back();</script>";
            exit();
        }
    } else {
        echo "<script>alert('Aucun compte trouvé avec cet email.'); window.history.back();</script>";
        exit();
    }

    $stmt->close();
    $conn->close();
}
?>
