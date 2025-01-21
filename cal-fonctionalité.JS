const modal = document.getElementById("RDV-modal");
const annuleModal = document.getElementById("annule-modal");

document.querySelectorAll(".creneau").forEach(slot => {
    slot.addEventListener("click", () => {
        modal.classList.remove("hidden");
        const [date, index] = slot.id.split(/(?=\d)/);
        document.getElementById("RDV-date").value = date.split("/").reverse().join("-");
        document.getElementById("debut-temp").value = Math.floor(index / 6) + 8;
    });
});

annuleModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

const RDVs = JSON.parse(localStorage.getItem("RDVs")) || [];

document.getElementById("RDV-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("RDV-date").value;
    const debuttemp = parseInt(document.getElementById("debut-temp").value);
    const fintemp = parseInt(document.getElementById("fin-temp").value);
    const title = document.getElementById("RDV-title").value;
    const couleur = document.getElementById("couleur").value;

    if (fintemp <= debuttemp) {
        alert("Temps fin de RDV doit etre different");
        return;
    }

    const debutSlot = (debuttemp - 8) * 6;
    const finSlot = (fintemp - 8) * 6 - 1;

    if (RDVs.some(a => a.date === date && overlap(a.debut, a.fin, debutSlot, finSlot))) {
        alert("Date bloquer");
        return;
    }

    RDVs.push({ date, debut: debutSlot, fin: finSlot, title, couleur });
    localStorage.setItem("RDV", JSON.stringify(RDVs));
    modal.classList.add("hidden");
    rfinerRDVs();
});

function overlap(debut1, fin1, debut2, fin2) {
    return !(fin1 < debut2 || debut1 > fin2);
}

function rfinerRDVs() {
    document.querySelectorAll(".rdv").forEach(rdv => rdv.remove());
    RDVs.forEach(({ date, debut, fin, couleur, title }) => {
        for (let i = debut; i <= fin; i++) {
            const slot = document.getElementById(`${date}${i}`);
            if (!slot) continue;

            slot.style.backgroundCouleur = couleur;
            slot.classList.add("rdv");
            if (i === debut) {
                slot.innerText = title;
                slot.style.couleur = "white";
            }
        }
    });
}

rfinerRDVs();