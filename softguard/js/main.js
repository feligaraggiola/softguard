/* =========================================================
   FUNCIONES DE SOFTGUARD
   Acá está lo que se usa en varias páginas a la vez:
   el botón de WhatsApp, el menú del celular, las pestañas,
   los filtros y la ventana emergente (para "ver detalle"
   y para ver los diagramas en grande).
   Lo que es de una sola página está en su propio archivo
   (por ejemplo js/kanban.js o js/encuesta.js).
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


/* ---------- 6. VENTANA EMERGENTE (MODAL) ----------
   Es el cuadro que aparece arriba de todo con el fondo oscuro.
   No está escrito en el HTML: lo armo acá la primera vez que se necesita,
   así no tengo que copiarlo en cada página. */
let modal = null;

function crearModal() {
  modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML =
    '<div class="modal-caja">' +
    '  <button class="modal-cerrar" aria-label="Cerrar">×</button>' +
    '  <div class="modal-contenido"></div>' +
    '</div>';
  document.body.appendChild(modal);

  // se cierra con la X...
  modal.querySelector(".modal-cerrar").addEventListener("click", cerrarModal);

  // ...tocando afuera del cuadro (en lo oscuro)...
  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
      cerrarModal();
    }
  });

  // ...o apretando la tecla Escape
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarModal();
    }
  });
}

// abre el modal con lo que le pase adentro (texto, una imagen, etc.)
function abrirModal(contenidoHTML) {
  if (!modal) {
    crearModal();
  }
  modal.querySelector(".modal-contenido").innerHTML = contenidoHTML;
  modal.classList.add("abierto");
  document.body.style.overflow = "hidden";        // que no se mueva la página de atrás
  modal.querySelector(".modal-cerrar").focus();
}

function cerrarModal() {
  if (modal) {
    modal.classList.remove("abierto");
    document.body.style.overflow = "";
  }
}


/* ---------- 7. VER DETALLE (página Técnicas) ----------
   Al tocar "VER DETALLE +" se abre la ventana emergente con
   más información. Lo que muestra está escrito en el HTML,
   en un bloque escondido que tiene el mismo nombre que dice data-modal. */
const botonesModal = document.querySelectorAll("[data-modal]");

botonesModal.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const contenido = document.getElementById(boton.dataset.modal);
    abrirModal(contenido.innerHTML);
  });
});


/* ---------- 8. VER DIAGRAMAS EN GRANDE (páginas de Ilustraciones) ----------
   Cada diagrama es un botón. Al tocarlo, abro la ventana emergente
   con la misma imagen pero grande, con su título arriba. */
const diagramas = document.querySelectorAll("[data-lightbox]");

diagramas.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const imagen = boton.querySelector("img");
    abrirModal(
      "<h3>" + boton.dataset.lightbox + "</h3>" +
      '<img src="' + imagen.src + '" alt="' + imagen.alt + '">'
    );
  });
});


/* ---------- 9. AYUDITA PARA LAS ANIMACIONES ----------
   Esta función hace que la animación de "aparecer"
   se vuelva a reproducir cada vez que la llamo. */
function reiniciarAnimacion(elemento) {
  elemento.classList.remove("aparecer-rapido");
  void elemento.offsetWidth;   // truquito para que el navegador "se olvide" de la animación anterior
  elemento.classList.add("aparecer-rapido");
}
