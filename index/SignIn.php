<?php
echo "<script>console.log('SignIn possible');</script>";
session_start();
require_once "db_connect.php";

if (!$pdo) {
    die("Échec de la connexion à la base de données.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    var_dump($_POST);
    $nom = $_POST['nom'];
    $password = $_POST['psw'];

    if (empty($nom) || empty($password)) {
        die("Veuillez remplir tous les champs.");
    }

    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE nom = :nom");
    $stmt->bindParam(':nom', $nom);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['mot_de_passe']))
        // Connexion réussie
        $_SESSION['nom'] = $user['nom'];
        header("Location: ../patient.html");
        exit();
    } else {
        echo "Nom ou mot de passe incorrect.";
    }
} else {
    echo "Accès non autorisé.";
}
?>