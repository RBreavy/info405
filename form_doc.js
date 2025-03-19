function openNav() {
    document.getElementById("mySidenav").style.left = "0";
}

function closeNav() {
    document.getElementById("mySidenav").style.left = "-250px";
}

function toggleForm(type) {
    if (type === 'repetitif') {
        document.getElementById('form-repetitif').classList.remove('hidden');
        document.getElementById('form-temporaire').classList.add('hidden');
        document.getElementById('tab-repetitif').classList.add('active');
        document.getElementById('tab-repetitif').classList.remove('inactive');
        document.getElementById('tab-temporaire').classList.add('inactive');
        document.getElementById('tab-temporaire').classList.remove('active');
    } else {
        document.getElementById('form-repetitif').classList.add('hidden');
        document.getElementById('form-temporaire').classList.remove('hidden');
        document.getElementById('tab-temporaire').classList.add('active');
        document.getElementById('tab-temporaire').classList.remove('inactive');
        document.getElementById('tab-repetitif').classList.add('inactive');
        document.getElementById('tab-repetitif').classList.remove('active');
    }
}