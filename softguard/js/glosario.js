/* =========================================================
   GLOSARIO INTERACTIVO
   Todos los términos están en la lista de abajo. Con eso
   armo la página, el buscador y los botones de las letras.
   ========================================================= */


/* ---------- 1. LOS TÉRMINOS ----------
   Para agregar uno nuevo, se suma una línea acá y listo:
   se ordena y se ubica en su letra solo. */
const terminos = [
  { palabra: "Agile", definicion: "Enfoque de desarrollo iterativo que prioriza la colaboración y la adaptación al cambio." },
  { palabra: "Backlog", definicion: "Lista priorizada de trabajo pendiente del producto o del Sprint." },
  { palabra: "Bug", definicion: "Defecto en el software que produce un resultado incorrecto o inesperado." },
  { palabra: "Caja blanca", definicion: "Pruebas que analizan la estructura interna y el flujo del código." },
  { palabra: "Caja negra", definicion: "Pruebas que evalúan el comportamiento sin conocer el código interno." },
  { palabra: "Cobertura", definicion: "Porcentaje del código o de los requisitos ejercitado por las pruebas." },
  { palabra: "Daily", definicion: "Reunión diaria breve del equipo Scrum para sincronizar el trabajo." },
  { palabra: "Definition of Done", definicion: "Criterios que debe cumplir una tarea para considerarse terminada." },
  { palabra: "Deuda técnica", definicion: "Costo futuro de elegir una solución rápida en lugar de la mejor." },
  { palabra: "Incremento", definicion: "Versión utilizable del producto que se suma a las anteriores." },
  { palabra: "ISO/IEC 25000", definicion: "Familia de normas SQuaRE para evaluar la calidad del software." },
  { palabra: "Kanban", definicion: "Método que visualiza el trabajo y limita el trabajo en curso." },
  { palabra: "Métrica", definicion: "Medida objetiva que permite evaluar y comparar la calidad." },
  { palabra: "Prueba de regresión", definicion: "Prueba que verifica que un cambio no rompió lo que ya funcionaba." },
  { palabra: "QA", definicion: "Aseguramiento de la calidad: actividades que previenen defectos en el proceso." },
  { palabra: "Refactorización", definicion: "Mejora de la estructura del código sin cambiar su comportamiento." },
  { palabra: "Scrum", definicion: "Marco ágil basado en Sprints, roles, eventos y artefactos." },
  { palabra: "Sprint", definicion: "Periodo de 1 a 4 semanas en el que se construye un Incremento." },
  { palabra: "SDLC", definicion: "Ciclo de vida del desarrollo de software, de los requisitos al mantenimiento." },
  { palabra: "TDD", definicion: "Desarrollo guiado por pruebas: primero la prueba, luego el código." },
  { palabra: "WIP", definicion: "Work in progress: cantidad de trabajo en curso al mismo tiempo." }
];


/* ---------- 2. AYUDITAS ---------- */

// saca los acentos y pasa a minúscula, así "metrica" encuentra "Métrica"
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// la letra con la que empieza un término (sin acento)
function primeraLetra(termino) {
  return normalizar(termino.palabra).charAt(0).toUpperCase();
}

// pinta en blanco la parte de la palabra que coincide con la búsqueda
function resaltar(palabra, busqueda) {
  if (!busqueda) {
    return palabra;
  }
  const inicio = normalizar(palabra).indexOf(busqueda);
  if (inicio === -1) {
    return palabra;
  }
  const fin = inicio + busqueda.length;
  return palabra.slice(0, inicio) + "<mark>" + palabra.slice(inicio, fin) + "</mark>" + palabra.slice(fin);
}


/* ---------- 3. BUSCO LAS COSAS DE LA PÁGINA ---------- */
const buscador = document.getElementById("buscador");
const cajaLetras = document.getElementById("letras");
const lista = document.getElementById("lista-glosario");
const sinResultados = document.getElementById("sin-resultados");

let letraElegida = "TODAS";

// ordeno los términos de la A a la Z
terminos.sort(function (a, b) {
  return normalizar(a.palabra).localeCompare(normalizar(b.palabra));
});


/* ---------- 4. LOS BOTONES DE LAS LETRAS ----------
   Un botón "Todas" y uno por cada letra. Las letras que no
   tienen ningún término quedan apagadas. */
const letrasConTerminos = terminos.map(primeraLetra);
const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let botonesHtml = '<button class="pastilla activa" data-letra="TODAS">Todas</button>';
abecedario.forEach(function (letra) {
  const tiene = letrasConTerminos.includes(letra);
  botonesHtml += '<button class="pastilla letra" data-letra="' + letra + '"' + (tiene ? "" : " disabled") + ">" + letra + "</button>";
});
cajaLetras.innerHTML = botonesHtml;

cajaLetras.querySelectorAll("button").forEach(function (boton) {
  boton.addEventListener("click", function () {
    letraElegida = boton.dataset.letra;
    buscador.value = "";   // al elegir una letra, borro la búsqueda
    marcarLetra();
    mostrar();
  });
});

function marcarLetra() {
  cajaLetras.querySelectorAll("button").forEach(function (b) {
    b.classList.toggle("activa", b.dataset.letra === letraElegida);
  });
}


/* ---------- 5. MOSTRAR LA LISTA ----------
   Filtra los términos según lo escrito y la letra elegida,
   y los muestra agrupados por letra. */
function mostrar() {
  const busqueda = normalizar(buscador.value.trim());

  const visibles = terminos.filter(function (t) {
    const coincideTexto = normalizar(t.palabra).includes(busqueda) || normalizar(t.definicion).includes(busqueda);
    const coincideLetra = letraElegida === "TODAS" || primeraLetra(t) === letraElegida;
    return coincideTexto && coincideLetra;
  });

  let html = "";
  let letraAnterior = "";

  visibles.forEach(function (t) {
    const letra = primeraLetra(t);

    // cuando cambia la letra, cierro el grupo anterior y abro uno nuevo
    if (letra !== letraAnterior) {
      if (letraAnterior !== "") {
        html += "</dl></div>";
      }
      html += '<div class="grupo-letra aparecer-rapido"><h2>' + letra + '</h2><dl class="termino">';
      letraAnterior = letra;
    }

    html += "<dt>" + resaltar(t.palabra, busqueda) + "</dt><dd>" + t.definicion + "</dd>";
  });

  if (letraAnterior !== "") {
    html += "</dl></div>";
  }

  lista.innerHTML = html;
  sinResultados.hidden = visibles.length > 0;
}


/* ---------- 6. EL BUSCADOR ----------
   Cada vez que se escribe una letra, vuelvo a filtrar. */
buscador.addEventListener("input", function () {
  letraElegida = "TODAS";
  marcarLetra();
  mostrar();
});


/* ---------- 7. ARRANCO ---------- */
mostrar();
