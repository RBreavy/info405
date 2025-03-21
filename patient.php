<?php
session_start();

// Vérification de sécurité
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'patient') {
    header("Location: index.html");
    exit();
}

// Récupération du nom depuis la session
$nom = htmlspecialchars($_SESSION['nom']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="style_utilisateur.css">
    <link rel="stylesheet" href="calendrier/calendrier.css">
    <title>Patient</title>
</head>
<body>
    <div class="banner">
        <img src="logo.png" alt="Logo" class="banner-logo">
        <span class="menu-icon" onclick="openNav()">☰</span>
    </div>
    
    <div id="mySidenav" class="sidenav">
        <button class="closebtn" onclick="closeNav()">X</button>
        <a href="contact.html" class="buttons">Contact</a>
        <a href="logout.php" class="buttons">Déconnexion</a>
    </div>

    <div id="welcome-message" style="margin: 20px; font-size: 18px;">Bienvenue, <?php echo $nom; ?></div>

    <section class="main_cal">
        <article class = "selecteur">
            <article class = "selecteur_gauche">
            </article>
            <input type="date" id="calendrier" name="cal"/>
            <article class = "selecteur_droit"></article>
    </section>
    <section class="bouton_docteur">
    <article class = "docteur">
    </article>
</section>


   
</body>
<script src = "calendrier/calendrier.js"></script>
<script src = "JS/patient.js"></script>
<script src = "form_doc.js"></script>
</html>