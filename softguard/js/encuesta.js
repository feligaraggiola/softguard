/* =========================================================
   ENCUESTA DE PREFERENCIAS (ASISTENTE PASO A PASO)
   Muestra una pregunta por vez. Cada respuesta le suma puntos
   a algunas metodologías. Al final calcula qué porcentaje de
   coincidencia tiene cada una y muestra la que más sumó.
   ========================================================= */


/* ---------- 1. LAS METODOLOGÍAS ---------- */
const nombres = {
  cascada: "Cascada",
  v: "Modelo en V",
  iterativo: "Iterativo e incremental",
  scrum: "Scrum",
  kanban: "Kanban",
  xp: "XP"
};

const explicaciones = {
  cascada: "Tu proyecto tiene requisitos claros y estables. Avanzar fase por fase, con buena documentación, te va a dar orden y control.",
  v: "Tu proyecto es crítico y necesita control. El modelo en V te asegura que cada etapa tenga su prueba, ideal cuando hay normas que cumplir.",
  iterativo: "Te conviene construir el sistema por partes: así el cliente ve avances temprano sin perder la planificación general.",
  scrum: "Tu proyecto va a cambiar sobre la marcha y el cliente puede revisar seguido. Los Sprints cortos te ayudan a adaptarte rápido.",
  kanban: "Tu trabajo llega de forma continua. Un tablero con límites WIP te ayuda a ver el flujo y terminar las tareas sin saturarte.",
  xp: "Tu equipo es chico y técnico, y el cliente está cerca. Las prácticas de XP (programar de a dos, pruebas primero) te dan calidad y velocidad."
};


/* ---------- 2. LAS PREGUNTAS ----------
   Cada opción dice cuántos puntos le da a cada metodología. */
const preguntas = [
  {
    texto: "¿Qué tan estables son los requisitos?",
    opciones: [
      { texto: "Fijos y bien definidos", puntos: { cascada: 3, v: 3, iterativo: 1 } },
      { texto: "Se irán refinando", puntos: { iterativo: 3, scrum: 2, kanban: 1, xp: 1 } },
      { texto: "Cambian constantemente", puntos: { scrum: 3, xp: 3, kanban: 2 } }
    ]
  },
  {
    texto: "¿Cómo llega el trabajo al equipo?",
    opciones: [
      { texto: "Un proyecto con fecha y alcance cerrados", puntos: { cascada: 3, v: 2, iterativo: 1 } },
      { texto: "Un producto que crece por etapas", puntos: { scrum: 3, iterativo: 2, xp: 2 } },
      { texto: "Pedidos que llegan todo el tiempo (soporte)", puntos: { kanban: 3, xp: 1 } }
    ]
  },
  {
    texto: "¿Qué tan grave sería un error?",
    opciones: [
      { texto: "Muy grave: hay normas que cumplir", puntos: { v: 3, cascada: 2 } },
      { texto: "Importante, pero se puede corregir rápido", puntos: { scrum: 2, xp: 2, iterativo: 2, kanban: 1 } },
      { texto: "Lo que más importa es salir rápido", puntos: { kanban: 3, scrum: 1, xp: 1 } }
    ]
  },
  {
    texto: "¿Cuánto puede participar el cliente?",
    opciones: [
      { texto: "Solo al principio y al final", puntos: { cascada: 3, v: 2 } },
      { texto: "En revisiones cada pocas semanas", puntos: { scrum: 3, iterativo: 2 } },
      { texto: "Todos los días, casi como parte del equipo", puntos: { xp: 3, kanban: 1, scrum: 1 } }
    ]
  },
  {
    texto: "¿Cómo es tu equipo?",
    opciones: [
      { texto: "Grande, con roles bien separados", puntos: { cascada: 2, v: 2, iterativo: 2 } },
      { texto: "Mediano, de 5 a 10 personas", puntos: { scrum: 3, kanban: 2, iterativo: 1 } },
      { texto: "Chico y muy técnico", puntos: { xp: 3, kanban: 2 } }
    ]
  }
];

// acá guardo qué opción eligió en cada pregunta (null = todavía no respondió)
let respuestas = [null, null, null, null, null];
let paso = 0;


/* ---------- 3. BUSCO LAS COSAS DE LA PÁGINA ---------- */
const pasoPregunta = document.getElementById("paso-pregunta");
const pasoResultado = document.getElementById("paso-resultado");
const cajaOpciones = document.getElementById("opciones");
const barra = document.getElementById("barra-progreso");
const barraContenedor = barra.parentElement;
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");


/* ---------- 4. MOSTRAR UNA PREGUNTA ---------- */
function mostrarPregunta() {
  const pregunta = preguntas[paso];

  document.getElementById("numero-pregunta").textContent = "Pregunta " + (paso + 1) + " de " + preguntas.length;
  document.getElementById("texto-pregunta").textContent = pregunta.texto;

  // armo un botón por cada opción
  cajaOpciones.innerHTML = "";
  pregunta.opciones.forEach(function (opcion, i) {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.textContent = opcion.texto;
    boton.setAttribute("role", "radio");
    boton.setAttribute("aria-checked", respuestas[paso] === i);
    if (respuestas[paso] === i) {
      boton.classList.add("elegida");
    }

    boton.addEventListener("click", function () {
      respuestas[paso] = i;
      mostrarPregunta();          // la vuelvo a dibujar con la opción marcada
    });

    cajaOpciones.appendChild(boton);
  });

  // "Anterior" no anda en la primera; "Siguiente" no anda hasta que responda
  btnAnterior.disabled = paso === 0;
  btnSiguiente.disabled = respuestas[paso] === null;
  btnSiguiente.textContent = paso === preguntas.length - 1 ? "Ver resultado ▸" : "Siguiente ▸";

  actualizarBarra();
}


/* ---------- 5. LA BARRA DE PROGRESO ---------- */
function actualizarBarra() {
  const respondidas = respuestas.filter(function (r) {
    return r !== null;
  }).length;

  barra.style.width = (respondidas / preguntas.length) * 100 + "%";
  barraContenedor.setAttribute("aria-valuenow", respondidas);
}


/* ---------- 6. CALCULAR EL RESULTADO ----------
   Sumo los puntos que sacó cada metodología y los comparo con
   el máximo que podría haber sacado. Eso da el % de coincidencia. */
function calcular() {
  const lista = Object.keys(nombres).map(function (id) {
    let obtenidos = 0;
    let maximo = 0;

    preguntas.forEach(function (pregunta, n) {
      // lo máximo que esta metodología podía sacar en esta pregunta
      const posibles = pregunta.opciones.map(function (op) {
        return op.puntos[id] || 0;
      });
      maximo += Math.max.apply(null, posibles);

      // lo que sacó con la opción elegida
      obtenidos += pregunta.opciones[respuestas[n]].puntos[id] || 0;
    });

    return { id: id, porcentaje: Math.round((obtenidos / maximo) * 100) };
  });

  // ordeno de mayor a menor coincidencia
  lista.sort(function (a, b) {
    return b.porcentaje - a.porcentaje;
  });
  return lista;
}


/* ---------- 7. MOSTRAR EL RESULTADO ---------- */
function mostrarResultado() {
  const lista = calcular();
  const ganadora = lista[0];

  document.getElementById("ganadora").textContent = nombres[ganadora.id] + " · " + ganadora.porcentaje + "%";
  document.getElementById("explicacion").textContent = explicaciones[ganadora.id];

  let html = "";
  lista.forEach(function (item) {
    html +=
      '<div class="resultado-fila">' +
      "<span>" + nombres[item.id] + "</span>" +
      '<div class="resultado-barra"><div style="width:0" data-ancho="' + item.porcentaje + '%"></div></div>' +
      "<strong>" + item.porcentaje + "%</strong>" +
      "</div>";
  });
  document.getElementById("barras-resultado").innerHTML = html;

  pasoPregunta.hidden = true;
  pasoResultado.hidden = false;
  reiniciarAnimacion(pasoResultado);

  // un ratito después lleno las barras, así se ve cómo crecen
  setTimeout(function () {
    document.querySelectorAll("[data-ancho]").forEach(function (b) {
      b.style.width = b.dataset.ancho;
    });
  }, 100);
}


/* ---------- 8. LOS BOTONES ---------- */
btnAnterior.addEventListener("click", function () {
  paso--;
  mostrarPregunta();
  reiniciarAnimacion(pasoPregunta);
});

btnSiguiente.addEventListener("click", function () {
  if (paso < preguntas.length - 1) {
    paso++;
    mostrarPregunta();
    reiniciarAnimacion(pasoPregunta);
  } else {
    mostrarResultado();
  }
});

document.getElementById("btn-repetir").addEventListener("click", function () {
  respuestas = [null, null, null, null, null];
  paso = 0;
  pasoResultado.hidden = true;
  pasoPregunta.hidden = false;
  mostrarPregunta();
  reiniciarAnimacion(pasoPregunta);
});


/* ---------- 9. ARRANCO ---------- */
mostrarPregunta();
