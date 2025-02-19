<?php
include('db_connect.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['nom'], $_POST['mail'], $_POST['mdp'])) {
        $nom = $_POST['nom'];
        $mail = $_POST['mail'];
        $mdp = $_POST['mdp'];

        // Vérifier que l'email est valide
        if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Email invalide']);
            exit;
        }

        // Vérification du mot de passe
        if (strlen($mdp) < 6) {
            echo json_encode(['success' => false, 'message' => 'Le mot de passe doit comporter au moins 6 caractères']);
            exit;
        }

        // Hashage du mot de passe
        $mdp = password_hash($mdp, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nom, $mail, $mdp);
        $stmt->close();
        mysqli_close($conn);

    } else {
        echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    }

}
?>