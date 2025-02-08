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
        // Affiche les données de l'utilisateur récupérées pour déboguer
        echo "<pre>";
        print_r($user); 
        echo "</pre>";
    
        // Afficher le mot de passe en texte brut et le haché pour vérifier
        echo "Mot de passe soumis : $password <br>";
        echo "Mot de passe haché dans la base de données : " . $user['mot_de_passe'] . "<br>";
    
        if (password_verify($password, $user['mot_de_passe'])) {
            // Si le mot de passe est correct, on démarre la session et on redirige l'utilisateur
            $_SESSION['nom'] = $user['nom'];
            echo "Connexion réussie";
            header("Location: ../patient.html");
            exit();
        } else {
            // Si le mot de passe est incorrect
            echo "Nom ou mot de passe incorrect.";
        }
    } else {
        // Si l'utilisateur n'a pas été trouvé
        echo "Utilisateur non trouvé.";
    }
}
?>
