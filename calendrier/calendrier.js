const dateString = new Date().toLocaleDateString("fr-FR");
let [day, month, year] = dateString.split('/').map(Number);
let date = new Date(year, month - 1, day);
let indice_jour = date.getDay() || 7;
let offsetjour = 0;

console.log("Initialisation de la date:", date);

const dateInput = document.getElementById("calendrier");
dateInput.addEventListener('change', () => {
  [year, month, day] = dateInput.value.split("-").map(Number);
  if (year >= 2000 && year <= 2100) {
    console.log("Date sélectionnée:", dateInput.value);
    dateInput.value = "";
    date = new Date(year, month - 1, day);
    indice_jour = date.getDay() || 7;
    offsetjour = 0;
    maj_semaine();
  }
});

const main = document.querySelector(".main_cal");
console.log("Element main:", main);

const listeJour = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

const joursRDV = {
  lundi: "13/01/2025",
  jeudi: "16/01/2025",
  dimanche: "19/01/2025",
  mardi: "21/01/2025",
  mercredi: "22/01/2025",
  vendredi: "10/01/2025",
  samedi: "17/02/2025",
  samedi_fin: "18/02/2025"
};

const listeCreneau = [
  () => create_rdv(0, 71, joursRDV.lundi, joursRDV.lundi, "blue"),
  () => create_rdv(9, 51, joursRDV.jeudi, joursRDV.jeudi, "green"),
  () => create_rdv(5, 10, joursRDV.dimanche, joursRDV.dimanche, "red"),
  () => create_rdv(6, 10, joursRDV.mardi, joursRDV.mardi, "blue"),
  () => create_rdv(4, 14, joursRDV.mercredi, joursRDV.mercredi, "aqua"),
  () => create_rdv(17, 21, joursRDV.vendredi, joursRDV.vendredi, "white"),
  () => create_rdv(35, 41, joursRDV.vendredi, joursRDV.vendredi, "purple"),
  () => create_rdv(2, 50, joursRDV.samedi, joursRDV.samedi_fin, "orange", "docteur Dupont")
];

creation_jour();
listeCreneau.forEach(func => func());

function create(tag, container, text = null) {
  const element = document.createElement(tag);
  if (text) element.innerText = text;
  container.appendChild(element);
  return element;
}

function creation_jour() {
  console.log("Création des jours...");
  for (let i = 0; i < 7; i++) {
    const datetemp = new Date(date);
    datetemp.setDate(date.getDate() + i + 1 - indice_jour);

    const div_jour = create("div", main);
    div_jour.classList.add("jour");

    const article = create("article", div_jour);
    article.classList.add("datejour");

    const date_jour = datetemp.toLocaleDateString();
    create("p", article, `${listeJour[i]}\n${date_jour}`);
    div_jour.id = date_jour;

    creation_crenau(i, div_jour, datetemp);

    if (i === 0) div_jour.classList.add("border_bottom_top_left");
    if (i === 6) div_jour.classList.add("border_bottom_top_right", "border_right");
  }
  console.log("Jours créés.");
}

function maj_semaine() {
  console.log("Mise à jour de la semaine...");
  maj_date();
  maj_id();
  maj_rdv();
  console.log("Semaine mise à jour.");
}

function maj_date() {
  console.log("Mise à jour des dates...");
  document.querySelectorAll(".jour").forEach((e, index) => {
    const datetemp = new Date(year, month - 1, day);
    datetemp.setDate(date.getDate() + index + offsetjour + 1 - indice_jour);
    const date_jour = datetemp.toLocaleDateString();
    e.id = date_jour;
    e.querySelector(".datejour > p").innerText = `${listeJour[index]}\n${date_jour}`;
  });
  console.log("Dates mises à jour.");
}

function maj_id() {
  console.log("Mise à jour des ID...");
  document.querySelectorAll(".jour").forEach(e => {
    e.querySelectorAll(".creneau").forEach((c, i) => {
      c.id = `${e.id}${i}`;
    });
  });
  console.log("ID mis à jour.");
}

function maj_rdv() {
  console.log("Mise à jour des rendez-vous...");
  document.querySelectorAll(".rdv").forEach(e => e.remove());
  document.querySelectorAll(".custom_bg_color").forEach(e => {
    e.classList.remove("custom_bg_color", "custom_border_top", "invisible_border_top", "invisible_border_bottom");
  });
  listeCreneau.forEach(func => func());
  console.log("Rendez-vous mis à jour.");
}

function creation_crenau(index, div_jour, datetemp) {
  console.log(`Création des créneaux pour ${datetemp.toLocaleDateString()}...`);
  let heure = 8;
  for (let j = 0; j < 72; j++) {
    const article = create("article", div_jour);
    article.id = `${datetemp.toLocaleDateString()}${j}`;
    article.classList.add("creneau");
    if (j % 6 === 0) article.classList.add("border_top");
    article.classList.add(j % 2 === 0 ? "gris_fonce" : "gris_clair");

    if (index === 0 && j % 6 === 0) {
      const carre = create("div", article);
      carre.classList.add("carre_heure");
      const texte = create("p", carre, `${heure}h00`);
      texte.classList.add("heure");
      heure++;
    }

    if (j === 71) {
      article.classList.add(index === 0 ? "article_border_bottom_left_radius" : "");
      article.classList.add(index === 6 ? "article_border_bottom_right_radius" : "");
    }

    article.addEventListener("click", () => console.log("Créneau cliqué:", article.id));
  }
  console.log(`Créneaux pour ${datetemp.toLocaleDateString()} créés.`);
}

function calcul_duree(start, duree) {
  const h1 = 8 + Math.floor((start + 1) / 6), m1 = start % 6;
  const h2 = 8 + Math.floor((start + duree + 1) / 6), m2 = (start + duree + 1) % 6;
  const format = (h, m) => `${h}h${m}0`.slice(0, 5);
  return `${format(h1, m1)} - ${format(h2, m2)}`;
}

function create_rdv(start, end, jour, jourFin = jour, color = "yellow", texte = "") {
  const duree = 30;
  if (start > -1 && end < 72 && document.getElementById(jour)) {
    for (let i = start; i <= end; i++) {
      const id = `${jour}${i}`;
      const slot = document.getElementById(id);
      if (!slot) continue;

      slot.style.setProperty('--border-color', color);
      slot.classList.add("custom_bg_color");

      if (i === start) {
        const box = create("article", slot);
        create("p", box, texte);
        create("p", box, calcul_duree(start, duree));
        create("p", box, calcul_duree(start, end - start - 1));
        box.classList.add("rdv");
        box.style.height = `${slot.offsetHeight * (duree + 1) - 3}px`;
      }

      if (i % 6 === 0 && i !== start) slot.classList.add('custom_border_top');
      if (i === start && i % 6 !== 0) slot.classList.add("invisible_border_top");
      if (i === end && (i + 1) % 6 !== 0) slot.classList.add("invisible_border_bottom");
    }
  }
}

const boutonG = document.querySelector(".selecteur_gauche");
const boutonD = document.querySelector(".selecteur_droit");

boutonG.addEventListener('click', () => {
  offsetjour -= 7;
  animate_transition('transition_cal_g');
  maj_semaine();
});

boutonD.addEventListener('click', () => {
  offsetjour += 7;
  animate_transition('transition_cal_d');
  maj_semaine();
});

function animate_transition(className) {
  document.querySelectorAll(".jour").forEach(e => {
    e.classList.remove(className);
    e.classList.add(className);
    setTimeout(() => e.classList.remove(className), 1000);
  });
}
