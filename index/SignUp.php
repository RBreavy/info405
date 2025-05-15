<?php
session_start();

include_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!empty($_POST['nom']) && !empty($_POST['mail']) && !empty($_POST['mdp'])) {
        $nom = trim($_POST['nom']);
        $mail = trim($_POST['mail']);
        $mdp = trim($_POST['mdp']);
        $mdp_hache = password_hash($mdp, PASSWORD_DEFAULT);

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

        // Vérifier si l'email existe déjà
        $check_stmt = $conn->prepare("SELECT id_utilisateurs FROM utilisateurs WHERE email = ?");
        $check_stmt->bind_param("s", $mail);
        $check_stmt->execute();
        $check_stmt->store_result();

        if ($check_stmt->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Cet email est déjà utilisé']);
            $check_stmt->close();
            $conn->close();
            exit;
        }
        $check_stmt->close();
            

        // Requête préparée
        $stmt = $conn->prepare("INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nom, $mail, $mdp_hache);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
            exit();
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de l’insertion : ' . $stmt->error]);
        }

        $stmt->close();
        $conn->close();

    } else {
        echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    }

}
?>