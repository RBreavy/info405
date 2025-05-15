<?php
session_start();
require_once "db_connect.php";

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nom = htmlspecialchars(trim($_POST['nom']), ENT_QUOTES, 'UTF-8');
    $password = trim($_POST['psw']);

    if (empty($nom) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs.']);
        exit;
    }

    // Vérification dans la table utilisateurs
    $stmt = $conn->prepare("SELECT * FROM utilisateurs WHERE nom = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Erreur serveur (utilisateur)']);
        exit;
    }

    $stmt->bind_param('s', $nom);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if ($user && $password === $user['mot_de_passe']) {
        $_SESSION['nom'] = $user['nom'];
        $_SESSION['user_id'] = $user['id_utilisateurs'];
        $_SESSION['user_type'] = 'patient';
        session_regenerate_id(true);

        echo json_encode(['success' => true, 'redirect' => '../patient.php']);
        exit;
    }

    // Vérification dans la table medecin
    $stmt = $conn->prepare("SELECT * FROM medecin WHERE nom = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Erreur serveur (médecin)']);
        exit;
    }

    $stmt->bind_param('s', $nom);
    $stmt->execute();
    $result = $stmt->get_result();
    $medecin = $result->fetch_assoc();
    $stmt->close();

    if ($medecin && $password === $medecin['mot_de_passe']) {
        $_SESSION['nom'] = $medecin['nom'];
        $_SESSION['user_id'] = $medecin['id_medecin'];
        $_SESSION['user_type'] = 'medecin';
        session_regenerate_id(true);

        echo json_encode(['success' => true, 'redirect' => '../Vue_docteur.php']);
        exit;
    }

    // Si échec
    echo json_encode(['success' => false, 'message' => 'Nom ou mot de passe incorrect.']);
    $conn->close();
}
?>
