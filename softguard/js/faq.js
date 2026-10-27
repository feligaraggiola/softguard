/* =========================================================
   PREGUNTAS FRECUENTES (ACORDEÓN)
   Al tocar una pregunta se abre su respuesta deslizándose,
   y si había otra abierta, esa se cierra.
   ========================================================= */

const preguntas = document.querySelectorAll(".pregunta");

// cierra una pregunta: la respuesta vuelve a altura 0
function cerrar(pregunta) {
  pregunta.classList.remove("abierta");
  pregunta.querySelector("button").setAttribute("aria-expanded", "false");
  pregunta.querySelector(".respuesta").style.maxHeight = "0";
}

// abre una pregunta: la respuesta crece hasta su alto real
function abrir(pregunta) {
  const respuesta = pregunta.querySelector(".respuesta");
  pregunta.classList.add("abierta");
  pregunta.querySelector("button").setAttribute("aria-expanded", "true");
  respuesta.style.maxHeight = respuesta.scrollHeight + "px";   // scrollHeight = lo que mide el texto
}

preguntas.forEach(function (pregunta) {
  pregunta.querySelector("button").addEventListener("click", function () {
    const estabaAbierta = pregunta.classList.contains("abierta");

    // primero cierro todas...
    preguntas.forEach(cerrar);

    // ...y si la que toqué estaba cerrada, la abro
    if (!estabaAbierta) {
      abrir(pregunta);
    }
  });
});
