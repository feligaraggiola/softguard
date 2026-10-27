/* =========================================================
   SCRUM: EL SPRINT INTERACTIVO
   Arma la barra del Sprint según cuántas semanas dura,
   y al tocar un bloque muestra su explicación abajo.
   ========================================================= */


/* ---------- 1. LOS DATOS ----------
   Cuánto dura cada evento según las semanas del Sprint
   (la Guía de Scrum da el máximo para un Sprint de un mes;
   para Sprints más cortos se usa proporcionalmente menos). */
const duraciones = {
  1: { planning: "Hasta 2 h", review: "Hasta 1 h", retro: "Hasta 45 min" },
  2: { planning: "Hasta 4 h", review: "Hasta 2 h", retro: "Hasta 1 h 30 min" },
  3: { planning: "Hasta 6 h", review: "Hasta 3 h", retro: "Hasta 2 h 15 min" },
  4: { planning: "Hasta 8 h", review: "Hasta 4 h", retro: "Hasta 3 h" }
};

const objetivos = {
  planning: "Definir qué se entregará en el Sprint y cómo se hará.",
  dia: "Desarrollar el Incremento. Arranca con la Daily: el equipo revisa el avance hacia el Objetivo del Sprint y planea las próximas 24 horas.",
  review: "Mostrar lo terminado a los interesados y recibir su opinión para ajustar el Product Backlog.",
  retro: "Pensar cómo mejorar la forma de trabajar: qué salió bien, qué no y qué se va a cambiar."
};


/* ---------- 2. BUSCO LAS COSAS DE LA PÁGINA ---------- */
const barra = document.getElementById("sprint-barra");
const infoEvento = document.getElementById("info-evento");
const botonesSemanas = document.querySelectorAll("[data-semanas]");

let semanas = 2;          // empieza con un Sprint de 2 semanas
let elegido = "planning"; // y con Planning elegido


/* ---------- 3. ARMAR LA BARRA ----------
   Borra la barra y la vuelve a armar: Planning, un cuadradito
   por cada día de trabajo (5 por semana), Review y Retrospective. */
function armarBarra() {
  let html = '<button class="bloque evento" data-tipo="planning">Planning</button>';

  const dias = semanas * 5;
  for (let i = 1; i <= dias; i++) {
    html += '<button class="bloque" data-tipo="dia" data-dia="' + i + '" aria-label="Día ' + i + '"></button>';
  }

  html += '<span class="salto"></span>';   // en el celu, lo que sigue va abajo
  html += '<button class="bloque evento" data-tipo="review">Review</button>';
  html += '<button class="bloque evento" data-tipo="retro">Retrospective</button>';

  barra.innerHTML = html;

  // a cada bloque nuevo le digo qué hacer al tocarlo
  barra.querySelectorAll(".bloque").forEach(function (bloque) {
    bloque.addEventListener("click", function () {
      elegir(bloque);
    });
  });

  // vuelvo a marcar lo que estaba elegido (si era un día, vuelvo a Planning)
  const tipo = elegido === "dia" ? "planning" : elegido;
  elegir(barra.querySelector('[data-tipo="' + tipo + '"]'));
}


/* ---------- 4. ELEGIR UN BLOQUE ----------
   Marca el bloque tocado y escribe su información en la tarjeta. */
function elegir(bloque) {
  barra.querySelectorAll(".bloque").forEach(function (b) {
    b.classList.remove("activo");
  });
  bloque.classList.add("activo");

  const tipo = bloque.dataset.tipo;
  elegido = tipo;

  let titulo = "";
  let duracion = "";

  if (tipo === "planning") {
    titulo = "Planning";
    duracion = duraciones[semanas].planning;
  } else if (tipo === "review") {
    titulo = "Review";
    duracion = duraciones[semanas].review;
  } else if (tipo === "retro") {
    titulo = "Retrospective";
    duracion = duraciones[semanas].retro;
  } else {
    titulo = "Día " + bloque.dataset.dia + " · Daily + desarrollo";
    duracion = "Daily de 15 min, el resto del día se trabaja";
  }

  document.getElementById("evento-sprint").textContent =
    "Sprint de " + semanas + (semanas === 1 ? " semana" : " semanas");
  document.getElementById("evento-titulo").textContent = titulo;
  document.getElementById("evento-duracion").textContent = duracion;
  document.getElementById("evento-objetivo").textContent = objetivos[tipo];

  reiniciarAnimacion(infoEvento);
}


/* ---------- 5. LOS BOTONES DE SEMANAS ---------- */
botonesSemanas.forEach(function (boton) {
  boton.addEventListener("click", function () {
    botonesSemanas.forEach(function (b) {
      b.classList.remove("activa");
    });
    boton.classList.add("activa");

    semanas = Number(boton.dataset.semanas);
    armarBarra();
  });
});


/* ---------- 6. ARRANCO ---------- */
armarBarra();
