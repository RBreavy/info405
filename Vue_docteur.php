<?php
session_start();

// Vérification de sécurité
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'medecin') {
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
    <title>Document</title>
    
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



    <div id="welcome-message" style="margin: 20px; font-size: 18px;">Bienvenue, Dr. <?php echo $nom; ?></div>

    <section class="main_cal">
        <article class="selecteur">
            <article class="selecteur_gauche"></article>
            <input type="date" id="calendrier" name="cal"/>
            <article class="selecteur_droit"></article>
        </article>

    </section>

    <div class="form-box">
        <div class="tabs">
            <button id="tab-repetitif" class="tab active" onclick="toggleForm('repetitif')">RÉPÉTITIF</div>
            <button id="tab-temporaire" class="tab inactive" onclick="toggleForm('temporaire')">TEMPORAIRE</div>
        </div>

    <div id="form-repetitif">
            <button class="day-button selected">LUN</button>
            <button class="day-button">MAR</button>
            <button class="day-button">MER</button>
            <button class="day-button">JEU</button>
            <button class="day-button">VEN</button>
            <button class="day-button">SAM</button>
            <button class="day-button">DIM</button>
            <label>Heure début :</label>
            <input type="time">
            <label>Heure fin :</label>
            <input type="time">
            <button class="submit-button">ENVOYER</button>
        </div>
        
        <div id="form-temporaire" class="hidden">
            <label>Jour début :</label>
            <input type="date">
            <label>Jour fin :</label>
            <input type="date">
            <label>Heure début :</label>
            <input type="time">
            <label>Heure fin :</label>
            <input type="time">
            <button class="submit-button">ENVOYER</button>
        </div>
    </div>

</body>
<script src = "calendrier/calendrier.js"></script>
<script src = "form_doc.js"></script>
</html>