/* =========================================================
   METODOLOGÍAS ÁGILES: EL ÍNDICE QUE SE MARCA SOLO
   Mientras voy bajando por la página, el botón del índice
   de la parte que estoy leyendo se pone blanco.
   ========================================================= */

const linksIndice = document.querySelectorAll(".indice a");
const partes = document.querySelectorAll("main section[id]");

/* El "observador" avisa cada vez que una parte de la página
   entra en la zona del medio de la pantalla. */
const observador = new IntersectionObserver(function (avisos) {
  avisos.forEach(function (aviso) {
    if (aviso.isIntersecting) {
      const parte = aviso.target.id;

      // apago todos los botones y prendo solo el de la parte visible
      linksIndice.forEach(function (link) {
        link.classList.toggle("activa", link.getAttribute("href") === "#" + parte);
      });
    }
  });
}, {
  rootMargin: "-40% 0px -55% 0px"   // "el medio de la pantalla"
});

partes.forEach(function (parte) {
  observador.observe(parte);
});
