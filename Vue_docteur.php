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
    <link rel="stylesheet" href="/info2/site/CSS/style_utilisateur.css">
    <link rel="stylesheet" href="calendrier/calendrier.css">
    <title>Docteur page</title>

</head>

<body>
    <div class="banner">
        <img src="images/logo.png" alt="Logo" class="banner-logo">
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
            <input type="date" id="calendrier" name="cal" />
            <article class="selecteur_droit"></article>
        </article>

        <!-- Form-indisp will be positioned to the right of jour elements -->
        <div class="form-indisp">
            <div class="tabs">
                <button id="tab-repetitif" class="tab active" onclick="toggleForm('repetitif')">RÉPÉTITIF</button>
                <button id="tab-temporaire" class="tab inactive" onclick="toggleForm('temporaire')">TEMPORAIRE</button>
            </div>

            <div id="form-repetitif">
                <div class="day-buttons-container">
                    <button class="day-button lun selected" onclick="changeSelection('lun')">LUN</button>
                    <button class="day-button mar" onclick="changeSelection('mar')">MAR</button>
                    <button class="day-button mer" onclick="changeSelection('mer')">MER</button>
                    <button class="day-button jeu" onclick="changeSelection('jeu')">JEU</button>
                    <button class="day-button ven" onclick="changeSelection('ven')">VEN</button>
                    <button class="day-button sam" onclick="changeSelection('sam')">SAM</button>
                    <button class="day-button dim" onclick="changeSelection('dim')">DIM</button>
                </div>

                <label>Heure début :</label>
                <input type="time" min="08:00" max="20:00">
                <label>Heure fin :</label>
                <input type="time" min="08:00" max="20:00">
                <button class="submit-button" onclick="recupForm()">ENVOYER</button>
            </div>

            <div id="form-temporaire" class="hidden">
                <label>Jour début :</label>
                <input type="date">
                <label>Jour fin :</label>
                <input type="date">
                <label>Heure début :</label>
                <input type="time" min="08:00" max="20:00">
                <label>Heure fin :</label>
                <input type="time" min="08:00" max="20:00">
                <button class="submit-button" onclick="recupForm()">ENVOYER</button>
            </div>
        </div>
    </section>

</body>
<script src="calendrier/calendrier.js"></script>
<script src="form_doc.js"></script>
<script src="JS/docteur.js"></script>

</html>