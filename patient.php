<?php
session_start();

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'patient') {
    header("Location: /info2/site/HTML/connexion.html");
    exit();
}

$nom = htmlspecialchars($_SESSION['nom']);

?>
<!DOCTYPE html>
<html lang="fr">

<script>
    const nomUtilisateur = <?php echo json_encode($nom); ?>;
</script>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Patient</title>
    <link rel="stylesheet" href="/info2/site/CSS/style_utilisateur.css">
    <link rel="stylesheet" href="/info2/site/CSS/calendrier.css">
    <link rel="stylesheet" href="/info2/site/CSS/form_crea_rdv.css?v=1.1">
</head>

<body>
    <div class="banner">
        <img src="images/logo.png" alt="Logo" class="banner-logo">
        <div id="welcome-message">Bienvenue, <?php echo $nom; ?> </div>
        <span class="menu-icon" onclick="openNav()">☰</span>
    </div>

    <div id="mySidenav" class="sidenav">
        <button class="closebtn" onclick="closeNav()">X</button>
        <a href="/info2/site/HTML/contact.html" class="buttons">Contact</a>
        <a href="logout.php" class="buttons">Déconnexion</a>
    </div>



    <section class="main_cal">
        <!-- calendrier -->
        <article class="selecteur">
            <article class="selecteur_gauche"></article>
            <input type="date" id="calendrier" name="cal" />
            <article class="selecteur_droit"></article>
        </article>

        <script src="/info2/site/JS/calendrier.js"></script>

        <article>
            <!-- nom des medecins -->
            <section class="doctor-selection">
                <h2>Sélectionnez un médecin :</h2>
                <div class="doctor-list"></div>
            </section>

            <!-- form rendez-vous -->
            <section class="appointment-form" style="display: none;">
                <h2>Prendre rendez-vous avec <span id="selected-doctor-name"></span></h2>
                <form id="rdv-form">
                    <div class="form-group">
                        <label for="rdv-date">Date :</label>
                        <input type="date" id="rdv-date" required>
                    </div>
                    <div class="form-group">
                        <label for="rdv-time">Heure :</label>
                        <input type="time" id="rdv-time" min="08:00" max="19:30" required>
                    </div>
                    <div class="form-group">
                        <label for="rdv-duration">Durée :</label>
                        <select id="rdv-duration" required>
                            <option value="10">10 min</option>
                            <option value="20">20 min</option>
                            <option value="30">30 min</option>
                        </select>
                    </div>
                    <button type="submit">Confirmer</button>
                    <button type="button" id="cancel-appointment">Annuler</button>
                </form>
            </section>
        </article>
    </section>




    <script>

        const id = <?php echo json_encode($_SESSION['user_id']); ?>;
    </script>
    <script defer src="JS/patient.js"></script>
</body>

</html>