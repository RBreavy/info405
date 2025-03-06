<?php
session_start();
require_once "db_connect.php"; // Connexion à la base de données avec mysqli

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Récupérer les valeurs du formulaire
    $nom = $_POST['nom'];
    $password = $_POST['psw'];

    // Vérification que les champs ne sont pas vides
    if (empty($nom) || empty($password)) {
        die("Veuillez remplir tous les champs.");
    }

    // Requête pour chercher l'utilisateur avec le nom spécifié
    $stmt = $conn->prepare("SELECT * FROM utilisateurs WHERE nom = ?");
    $stmt->bind_param('s', $nom); // 's' pour chaîne (string)
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Comparer directement le mot de passe (puisque plus de hashage)
        if ($password === $user['mot_de_passe']) {
            $_SESSION['nom'] = $user['nom'];
            header("Location: ../patient.html");
            exit();
        } else {
            echo "Mot de passe incorrect.";
        }
    } else {
        echo "Utilisateur non trouvé.";
    }

    $stmt->close();
    $conn->close();
}
?>