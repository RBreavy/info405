console.log("docteur.js");

function changeSelection(jour) {
    document.querySelectorAll(".selected").forEach(e => {
        e.classList.remove("selected");
    });
    document.querySelector(jour).classList.add("selected");
}