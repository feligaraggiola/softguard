/* =========================================================
   EJERCICIOS: MOSTRAR / OCULTAR SOLUCIÓN
   Cada botón muestra la solución de su ejercicio
   (la que tiene el nombre que dice aria-controls).
   ========================================================= */

const botonesSolucion = document.querySelectorAll("[aria-controls^='sol-']");

botonesSolucion.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const solucion = document.getElementById(boton.getAttribute("aria-controls"));
    const seVe = solucion.classList.toggle("visible");

    // cambio el texto del botón según si la solución se ve o no
    boton.textContent = seVe ? "Ocultar solución" : "Mostrar solución";
    boton.setAttribute("aria-expanded", seVe);
    boton.classList.toggle("activa", seVe);
  });
});
