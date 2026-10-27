/* =========================================================
   CICLO DE VIDA DEL SOFTWARE (SDLC)
   Maneja la línea de tiempo: al tocar una etapa (o los botones
   Anterior / Siguiente) se muestra su información abajo.
   ========================================================= */


/* ---------- 1. LOS TEXTOS DE CADA ETAPA ----------
   Una lista con las 6 etapas, en orden. Si hay que cambiar
   algún texto, se cambia acá. */
const etapas = [
  {
    nombre: "Requisitos",
    texto: "Se recogen y analizan las necesidades de los usuarios y se define qué debe hacer el sistema.",
    importancia: "Los errores en esta etapa son los más caros de corregir más adelante."
  },
  {
    nombre: "Diseño",
    texto: "Se decide cómo se va a construir el sistema: su arquitectura, las pantallas, la base de datos y cómo se comunican las partes.",
    importancia: "Un buen diseño hace que el sistema sea más fácil de programar, probar y cambiar."
  },
  {
    nombre: "Desarrollo",
    texto: "Los programadores escriben el código siguiendo el diseño y las buenas prácticas acordadas por el equipo.",
    importancia: "Es donde la idea se convierte en un producto que funciona de verdad."
  },
  {
    nombre: "Pruebas",
    texto: "Se verifica que el software haga lo que tiene que hacer y se buscan errores antes de que lleguen al usuario.",
    importancia: "Encontrar un error acá es mucho más barato que encontrarlo cuando el sistema ya está en uso."
  },
  {
    nombre: "Despliegue",
    texto: "Se instala el sistema en el entorno real para que los usuarios lo empiecen a usar.",
    importancia: "Un despliegue ordenado evita cortes de servicio y pérdidas de datos."
  },
  {
    nombre: "Mantenimiento",
    texto: "Se corrigen errores que aparecen con el uso, se hacen mejoras y se adapta el sistema a cambios nuevos.",
    importancia: "Es la etapa más larga: el software sigue vivo y necesita cuidados mientras se use."
  }
];


/* ---------- 2. BUSCO LAS COSAS DE LA PÁGINA ---------- */
const botonesEtapa = document.querySelectorAll(".etapa");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const infoEtapa = document.getElementById("info-etapa");

let etapaActual = 0;   // empiezo en la primera (la 0 es la etapa 1)


/* ---------- 3. MOSTRAR UNA ETAPA ----------
   Cambia los textos de la tarjeta, marca el botón elegido
   y prende o apaga los botones Anterior / Siguiente. */
function mostrarEtapa(numero) {
  etapaActual = numero;
  const etapa = etapas[numero];

  document.getElementById("etapa-numero").textContent = "Etapa " + (numero + 1) + " de " + etapas.length;
  document.getElementById("etapa-titulo").textContent = etapa.nombre;
  document.getElementById("etapa-texto").textContent = etapa.texto;
  document.getElementById("etapa-importancia").textContent = etapa.importancia;

  // marco la etapa actual, y las anteriores como "ya vistas"
  botonesEtapa.forEach(function (boton, i) {
    boton.classList.toggle("activa", i === numero);
    boton.classList.toggle("vista", i < numero);
  });

  // en la primera etapa no hay "Anterior", y en la última no hay "Siguiente"
  btnAnterior.disabled = numero === 0;
  btnSiguiente.disabled = numero === etapas.length - 1;

  reiniciarAnimacion(infoEtapa);   // la tarjeta aparece de nuevo con animación
}


/* ---------- 4. LOS BOTONES ---------- */
botonesEtapa.forEach(function (boton) {
  boton.addEventListener("click", function () {
    mostrarEtapa(Number(boton.dataset.etapa));
  });
});

btnAnterior.addEventListener("click", function () {
  mostrarEtapa(etapaActual - 1);
});

btnSiguiente.addEventListener("click", function () {
  mostrarEtapa(etapaActual + 1);
});
