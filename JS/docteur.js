console.log("docteur.js");

function changeSelection(jour) {
    document.querySelectorAll(".selected").forEach(e => {
        e.classList.remove("selected");
    });
    let temp = document.querySelector(jour);
    console.log("temp");
    temp.classList.add("selected");
}