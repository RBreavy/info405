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
    <link rel="stylesheet" href="/info2/site/CSS/style_utilisateur.css">
    <link rel="stylesheet" href="calendrier/calendrier.css">
    <title>Patient page</title>
</head>

<body>
    <div class="banner">
        <img src="images/logo.png" alt="Logo" class="banner-logo">
        <div id="welcome-message" style="margin: 20px; font-size: 18px;">Bienvenue, <?php echo $nom; ?></div>
        <span class="menu-icon" onclick="openNav()">☰</span> <br>
    </div>

    <div id="mySidenav" class="sidenav">
        <button class="closebtn" onclick="closeNav()">X</button>
        <a href="contact.html" class="buttons">Contact</a>
        <a href="logout.php" class="buttons">Déconnexion</a>
    </div>



    <section class="main_cal">
        <article class="selecteur">
            <article class="selecteur_gauche">
            </article>
            <input type="date" id="calendrier" name="cal" />
            <article class="selecteur_droit"></article>
    </section>
    <section class="bouton_docteur">
        <section class="formulaire_rdv">
            <form id="rdv-form">
                <h2>Prise de rendez-vous</h2>

                <div class="form-group">
                    <label for="rdv-date">Date du rendez-vous :</label>
                    <input type="date" id="rdv-date" name="rdv-date" required>
                </div>

                <div class="form-group">
                    <label for="rdv-time">Heure du rendez-vous :</label>
                    <input type="time" id="rdv-time" name="rdv-time" min="08:00" required>
                </div>

                <div class="form-group">
                    <label for="rdv-duration">Durée du rendez-vous :</label>
                    <select id="rdv-duration" name="rdv-duration" required>
                        <option value="10">10 minutes</option>
                        <option value="20">20 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="40">40 minutes</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="rdv-docteur">Médecin :</label>
                    <select id="rdv-docteur" name="rdv-docteur" required></select>
                </div>

                <button type="submit">Prendre rendez-vous</button>
            </form>
        </section>

    </section>



</body>
<script src="calendrier/calendrier.js"></script>
<script src="JS/patient.js"></script>
<script src="form_doc.js"></script>

</html>