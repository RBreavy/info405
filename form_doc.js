function openNav() {
    document.getElementById("mySidenav").style.left = "0";
}

function closeNav() {
    document.getElementById("mySidenav").style.left = "-250px";
}

function toggleForm(type) {
    document.getElementById("form-repetitif").classList.toggle("hidden", type !== "repetitif");
    document.getElementById("form-temporaire").classList.toggle("hidden", type !== "temporaire");
    document.getElementById("tab-repetitif").classList.toggle("active", type === "repetitif");
    document.getElementById("tab-temporaire").classList.toggle("active", type === "temporaire");
}
