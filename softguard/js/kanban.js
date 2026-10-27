/* =========================================================
   KANBAN: EL TABLERO INTERACTIVO
   Guarda en una lista en qué columna está cada tarea,
   y cada vez que algo cambia vuelve a dibujar el tablero.
   ========================================================= */


/* ---------- 1. CÓMO ARRANCA EL TABLERO ---------- */
const LIMITE_WIP = 3;   // máximo de tareas en "En proceso"

const tareasIniciales = [
  { nombre: "Escribir casos de prueba", columna: "porhacer" },
  { nombre: "Diseñar pantalla de login", columna: "porhacer" },
  { nombre: "Revisar requisitos", columna: "porhacer" },
  { nombre: "Configurar CI", columna: "porhacer" },
  { nombre: "Corregir bug #12", columna: "proceso" },
  { nombre: "Publicar versión", columna: "hecho" }
];

// el orden de las columnas, para saber cuál es "la siguiente"
const columnas = ["porhacer", "proceso", "hecho"];

// copio la lista inicial (así "Reiniciar" puede volver a ella)
let tareas = copiarTareas();

function copiarTareas() {
  return tareasIniciales.map(function (t) {
    return { nombre: t.nombre, columna: t.columna };
  });
}


/* ---------- 2. DIBUJAR EL TABLERO ----------
   Vacía las 3 columnas y pone cada tarea en la suya. */
const aviso = document.getElementById("aviso-wip");

function dibujar() {
  columnas.forEach(function (col) {
    const lista = document.getElementById("lista-" + col);
    lista.innerHTML = "";

    tareas.forEach(function (tarea, numero) {
      if (tarea.columna !== col) {
        return;
      }

      const tarjeta = document.createElement("div");
      tarjeta.className = "tarea";
      tarjeta.draggable = true;              // se puede arrastrar
      tarjeta.dataset.numero = numero;
      tarjeta.textContent = tarea.nombre;

      // las que no están en "Hecho" tienen el botón ▸ para avanzar
      if (col !== "hecho") {
        const boton = document.createElement("button");
        boton.className = "mover";
        boton.textContent = "▸";
        boton.setAttribute("aria-label", "Pasar \"" + tarea.nombre + "\" a la columna siguiente");
        boton.addEventListener("click", function () {
          mover(numero, columnas[columnas.indexOf(col) + 1]);
        });
        tarjeta.appendChild(boton);
      }

      // cuando empiezo a arrastrar, me guardo qué tarea es
      tarjeta.addEventListener("dragstart", function (evento) {
        evento.dataTransfer.setData("text/plain", numero);
      });

      lista.appendChild(tarjeta);
    });
  });

  actualizarContadores();
}


/* ---------- 3. LOS CONTADORES DE ARRIBA ---------- */
function cuantas(col) {
  return tareas.filter(function (t) {
    return t.columna === col;
  }).length;
}

function actualizarContadores() {
  document.getElementById("contador-porhacer").textContent = cuantas("porhacer");
  document.getElementById("contador-proceso").textContent = cuantas("proceso") + "/" + LIMITE_WIP;
  document.getElementById("contador-hecho").textContent = cuantas("hecho");

  // si "En proceso" está llena, el contador se pone rojo
  const enProceso = document.querySelector('[data-columna="proceso"]');
  enProceso.classList.toggle("llena", cuantas("proceso") >= LIMITE_WIP);
}


/* ---------- 4. MOVER UNA TAREA ----------
   Antes de mover reviso el límite WIP: si "En proceso" ya tiene 3,
   no dejo meter otra, muestro el aviso y sacudo la columna. */
function mover(numero, destino) {
  const tarea = tareas[numero];

  if (tarea.columna === destino) {
    return;
  }

  if (destino === "proceso" && cuantas("proceso") >= LIMITE_WIP) {
    aviso.hidden = false;
    const columna = document.querySelector('[data-columna="proceso"]');
    columna.classList.remove("sacudir");
    void columna.offsetWidth;
    columna.classList.add("sacudir");
    return;
  }

  aviso.hidden = true;
  tarea.columna = destino;
  dibujar();
}


/* ---------- 5. ARRASTRAR Y SOLTAR ----------
   Cada columna "escucha" cuando le pasan una tarea por arriba
   y cuando la sueltan ahí. */
document.querySelectorAll(".col-kanban").forEach(function (columna) {

  columna.addEventListener("dragover", function (evento) {
    evento.preventDefault();               // esto permite soltar acá
    columna.classList.add("encima");
  });

  columna.addEventListener("dragleave", function () {
    columna.classList.remove("encima");
  });

  columna.addEventListener("drop", function (evento) {
    evento.preventDefault();
    columna.classList.remove("encima");
    const numero = Number(evento.dataTransfer.getData("text/plain"));
    mover(numero, columna.dataset.columna);
  });
});


/* ---------- 6. REINICIAR ---------- */
document.getElementById("btn-reiniciar").addEventListener("click", function () {
  tareas = copiarTareas();
  aviso.hidden = true;
  dibujar();
});


/* ---------- 7. ARRANCO ---------- */
dibujar();
