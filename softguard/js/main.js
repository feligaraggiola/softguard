/* =========================================================
   FUNCIONES DE SOFTGUARD
   Acá está todo lo que "se mueve" en la página:
   el botón de WhatsApp, el menú del celular, las pestañas,
   los filtros y los "ver detalle".
   ========================================================= */


/* ---------- 1. DATOS DE CONTACTO ----------
   Si hay que cambiar el número de WhatsApp, se cambia SOLO acá
   y se actualiza en todas las páginas.
   Va con código de país y sin espacios ni "+" (54 9 + característica + número). */
const NUMERO_WHATSAPP = "5492972416465";
const MENSAJE_WHATSAPP = "hola me encanto tu pagina soy el profe zeballos y te pongo 8.000 puntos";


/* ---------- 2. BOTÓN DEL TELÉFONO ----------
   Busca todos los botones redondos del teléfono y les pone
   el link de WhatsApp con el número y el mensaje de arriba. */
const botonesTelefono = document.querySelectorAll(".btn-telefono");

botonesTelefono.forEach(function (boton) {
  boton.href = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(MENSAJE_WHATSAPP);
  boton.target = "_blank";   // lo abre en otra pestaña para no perder la página
});


/* ---------- 3. MENÚ DEL CELULAR ----------
   Cuando se toca el botón de las tres rayitas,
   el menú se abre, y si se toca de nuevo se cierra. */
const botonMenu = document.querySelector(".btn-menu");
const menuCelular = document.querySelector(".menu-celular");

if (botonMenu && menuCelular) {
  botonMenu.addEventListener("click", function () {
    botonMenu.classList.toggle("abierto");
    menuCelular.classList.toggle("abierto");
  });
}


/* ---------- 4. PESTAÑAS (página Fundamentos) ----------
   Los botones "ISO 9126" e "ISO/IEC 25000" muestran
   un cuadro distinto cada uno. Al tocar uno, se esconde
   el otro cuadro y se muestra el que corresponde. */
const pestanas = document.querySelectorAll("[data-panel]");

pestanas.forEach(function (pestana) {
  pestana.addEventListener("click", function () {

    // primero apago todas las pestañas y escondo todos los cuadros
    pestanas.forEach(function (otra) {
      otra.classList.remove("activa");
      document.getElementById(otra.dataset.panel).hidden = true;
    });

    // después prendo la que toqué y muestro su cuadro con animación
    pestana.classList.add("activa");
    const panel = document.getElementById(pestana.dataset.panel);
    panel.hidden = false;
    reiniciarAnimacion(panel);
  });
});


/* ---------- 5. FILTROS (página Herramientas) ----------
   Cada botón de arriba tiene una categoría. Al tocarlo,
   solo quedan visibles las tarjetas de esa categoría.
   "Todas" vuelve a mostrar todo. */
const filtros = document.querySelectorAll("[data-filtro]");
const herramientas = document.querySelectorAll("[data-categoria]");

filtros.forEach(function (filtro) {
  filtro.addEventListener("click", function () {

    // marco como elegido solo el botón que toqué
    filtros.forEach(function (otro) {
      otro.classList.remove("activa");
    });
    filtro.classList.add("activa");

    // reviso tarjeta por tarjeta si se muestra o se esconde
    const elegido = filtro.dataset.filtro;

    herramientas.forEach(function (tarjeta) {
      if (elegido === "todas" || tarjeta.dataset.categoria === elegido) {
        tarjeta.classList.remove("oculta");
        reiniciarAnimacion(tarjeta);
      } else {
        tarjeta.classList.add("oculta");
      }
    });
  });
});


/* ---------- 6. VER DETALLE (página Técnicas) ----------
   Al tocar "VER DETALLE +" se despliega más información
   abajo, y el "+" pasa a ser "−". Si se toca otra vez, se cierra. */
const botonesDetalle = document.querySelectorAll(".ver-detalle[data-detalle]");

botonesDetalle.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const detalle = document.getElementById(boton.dataset.detalle);
    const estaAbierto = detalle.classList.toggle("visible");

    if (estaAbierto) {
      boton.textContent = "Ver menos −";
    } else {
      boton.textContent = "Ver detalle +";
    }
  });
});


/* ---------- 7. AYUDITA PARA LAS ANIMACIONES ----------
   Esta función hace que la animación de "aparecer"
   se vuelva a reproducir cada vez que la llamo. */
function reiniciarAnimacion(elemento) {
  elemento.classList.remove("aparecer-rapido");
  void elemento.offsetWidth;   // truquito para que el navegador "se olvide" de la animación anterior
  elemento.classList.add("aparecer-rapido");
}
