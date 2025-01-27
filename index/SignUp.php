<?php
include "db_connect.php"; // Connexion à la base de données

if (!$conn) {
    die("Erreur de connection: " . mysqli_connect_error());
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nom = mysqli_real_escape_string($conn, $_POST['nom']);
    $mail = mysqli_real_escape_string($conn, $_POST['mail']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    if (empty($nom) || empty($mail) || empty($password)) {
        echo "<script>alert('Veuillez remplir tous les champs.');</script>";
    } else {

        //$password_hashed = password_hash($password, PASSWORD_BCRYPT);

        $sql = "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES ('$nom', '$mail', '$password')";

        if (mysqli_query($conn, $sql)) {
            echo "<script>alert('Enregistrement réussi !');</script>";
            header("Location: ../patient.html"); // Redirection après succès
            exit();
        } else {
            echo "<script>alert('Erreur : " . mysqli_error($conn) . "');</script>";
        }
    }
}
?>