/* =========================================================
   FORMULARIO DE CONTACTO
   Revisa que los datos estén bien antes de enviar.
   Si algo está mal, avisa abajo de esa caja.
   Si está todo bien, arma el mensaje y abre WhatsApp
   (al mismo número del botón del teléfono, que está en js/main.js).
   ========================================================= */

const formulario = document.getElementById("form-contacto");
const campoNombre = document.getElementById("nombre");
const campoEmail = document.getElementById("email");
const campoTipo = document.getElementById("tipo");
const campoMensaje = document.getElementById("mensaje");
const mensajeOk = document.getElementById("mensaje-ok");


/* ---------- 1. MOSTRAR U OCULTAR UN ERROR ---------- */
function marcarError(campo, texto) {
  document.getElementById("error-" + campo.id).textContent = texto;
  campo.classList.toggle("invalido", texto !== "");
  campo.setAttribute("aria-invalid", texto !== "");
}


/* ---------- 2. LAS REGLAS DE CADA CAMPO ----------
   Cada función devuelve true si el dato está bien. */
function revisarNombre() {
  const valor = campoNombre.value.trim();
  if (valor.length < 2) {
    marcarError(campoNombre, "Escribí tu nombre (al menos 2 letras).");
    return false;
  }
  marcarError(campoNombre, "");
  return true;
}

function revisarEmail() {
  const valor = campoEmail.value.trim();
  // un mail tiene que tener: algo, una @, algo, un punto y algo más (ej: ana@gmail.com)
  const formaDeMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (valor === "") {
    marcarError(campoEmail, "Escribí tu correo electrónico.");
    return false;
  }
  if (!formaDeMail.test(valor)) {
    marcarError(campoEmail, "Ese correo no parece válido. Ejemplo: ana@gmail.com");
    return false;
  }
  marcarError(campoEmail, "");
  return true;
}

function revisarMensaje() {
  const valor = campoMensaje.value.trim();
  if (valor.length < 10) {
    marcarError(campoMensaje, "El mensaje tiene que tener al menos 10 caracteres.");
    return false;
  }
  marcarError(campoMensaje, "");
  return true;
}


/* ---------- 3. REVISAR MIENTRAS ESCRIBE ----------
   Cuando sale de una caja, la reviso. Y si ya tenía error,
   la vuelvo a revisar mientras escribe, así el aviso se va solo. */
[[campoNombre, revisarNombre], [campoEmail, revisarEmail], [campoMensaje, revisarMensaje]].forEach(function (par) {
  const campo = par[0];
  const revisar = par[1];

  campo.addEventListener("blur", revisar);
  campo.addEventListener("input", function () {
    if (campo.classList.contains("invalido")) {
      revisar();
    }
  });
});


/* ---------- 4. AL TOCAR "ENVIAR" ---------- */
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();   // que la página no se recargue

  // reviso todo (sin cortar en el primero, así se ven todos los errores juntos)
  const nombreOk = revisarNombre();
  const emailOk = revisarEmail();
  const mensajeOkValido = revisarMensaje();

  if (!nombreOk || !emailOk || !mensajeOkValido) {
    mensajeOk.hidden = true;
    // llevo el cursor a la primera caja con error
    formulario.querySelector(".invalido").focus();
    return;
  }

  // armo el texto que va a llegar por WhatsApp
  const texto =
    "Hola SoftGuard! Les escribo desde la página.\n" +
    "Nombre: " + campoNombre.value.trim() + "\n" +
    "Correo: " + campoEmail.value.trim() + "\n" +
    "Tipo: " + campoTipo.value + "\n" +
    "Mensaje: " + campoMensaje.value.trim();

  window.open("https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank", "noopener");

  mensajeOk.hidden = false;
  formulario.reset();
});
