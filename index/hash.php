<?php
require_once "db_connect.php";

// Table utilisateurs : id_utilisateurs, nom, email, mot_de_passe

$result = $conn->query("SELECT id_utilisateurs, mot_de_passe FROM utilisateurs");

while ($row = $result->fetch_assoc()) {
    $id = $row['id_utilisateurs'];
    $mdp = $row['mot_de_passe'];

    // Vérifie si déjà hashé (évite de re-hasher plusieurs fois)
    if (!password_get_info($mdp)['algo']) {
        $hash = password_hash($mdp, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("UPDATE utilisateurs SET mot_de_passe = ? WHERE id_utilisateurs = ?");
        $stmt->bind_param("si", $hash, $id);
        $stmt->execute();
        $stmt->close();

        echo "✅ Utilisateur #$id mis à jour.<br>";
    } else {
        echo "ℹ️ Utilisateur #$id déjà hashé, ignoré.<br>";
    }
}

$conn->close();
?>
