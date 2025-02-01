<?php
session_start();
include "db_connect.php";

// Méthode POST 
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nom = trim($_POST['nom']);
    $password = trim($_POST['psw']);

    // Rechercher l'utilisateur dans la base de données
    $stmt = $conn->prepare("SELECT id, nom, mot_de_passe FROM utilisateurs WHERE nom = $nom");
    $stmt->bind_param("s", $nom);   // indique que c'est un String
    $stmt->execute();               // exec le prepare
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
