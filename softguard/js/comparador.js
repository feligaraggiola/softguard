/* =========================================================
   COMPARADOR DE METODOLOGÍAS
   Todos los datos están en una lista de "objetos" (uno por
   metodología). Según cuáles elija el usuario, armo la tabla.
   ========================================================= */


/* ---------- 1. LOS DATOS ----------
   Cada metodología tiene las mismas 7 características.
   Para sumar una metodología nueva, se agrega un bloque más acá. */
const metodologias = [
  {
    id: "cascada", nombre: "Cascada",
    enfoque: "Secuencial por fases", roles: "Roles definidos por fase", flexibilidad: "Baja",
    entregas: "Una sola entrega final", documentacion: "Extensa", cliente: "Al inicio y al final",
    ideal: "Requisitos estables"
  },
  {
    id: "v", nombre: "Modelo en V",
    enfoque: "Secuencial, cada fase con su prueba", roles: "Analistas, desarrolladores y testers", flexibilidad: "Baja",
    entregas: "Una sola entrega final", documentacion: "Muy extensa", cliente: "Al inicio y en la aceptación",
    ideal: "Sistemas críticos y regulados"
  },
  {
    id: "iterativo", nombre: "Iterativo",
    enfoque: "Ciclos que agregan partes", roles: "Equipo tradicional por fases", flexibilidad: "Media",
    entregas: "Un incremento por ciclo", documentacion: "Moderada", cliente: "Al final de cada ciclo",
    ideal: "Proyectos medianos o grandes"
  },
  {
    id: "scrum", nombre: "Scrum",
    enfoque: "Sprints de 1 a 4 semanas", roles: "Product Owner, Scrum Master, Developers", flexibilidad: "Alta",
    entregas: "Un Incremento por Sprint", documentacion: "Ligera", cliente: "Continua (Product Owner)",
    ideal: "Requisitos cambiantes"
  },
  {
    id: "kanban", nombre: "Kanban",
    enfoque: "Flujo continuo con límites WIP", roles: "No prescribe roles", flexibilidad: "Muy alta",
    entregas: "Continuas, cuando algo está listo", documentacion: "Mínima", cliente: "Cuando se necesite",
    ideal: "Soporte y mantenimiento"
  },
  {
    id: "xp", nombre: "XP",
    enfoque: "Iteraciones cortas y prácticas técnicas", roles: "Cliente, programador, coach y tester", flexibilidad: "Alta",
    entregas: "Releases pequeñas y frecuentes", documentacion: "Mínima (el código y las pruebas)", cliente: "Integrado al equipo",
    ideal: "Equipos chicos que priorizan calidad técnica"
  }
];

// las filas de la tabla: el nombre que se ve y el dato que va
const filas = [
  { titulo: "Enfoque", dato: "enfoque" },
  { titulo: "Roles", dato: "roles" },
  { titulo: "Flexibilidad", dato: "flexibilidad" },
  { titulo: "Entregas", dato: "entregas" },
  { titulo: "Documentación", dato: "documentacion" },
  { titulo: "Cliente", dato: "cliente" },
  { titulo: "Ideal para", dato: "ideal" }
];

// las que aparecen elegidas al entrar
let elegidas = ["cascada", "scrum"];


/* ---------- 2. LOS BOTONES ---------- */
const cajaBotones = document.getElementById("botones-metodologias");
const resultado = document.getElementById("resultado-comparador");

metodologias.forEach(function (m) {
  const boton = document.createElement("button");
  boton.className = "pastilla";
  boton.textContent = m.nombre;
  boton.dataset.id = m.id;

  boton.addEventListener("click", function () {
    // si estaba elegida la saco, y si no estaba la agrego
    if (elegidas.includes(m.id)) {
      elegidas = elegidas.filter(function (id) {
        return id !== m.id;
      });
    } else {
      elegidas.push(m.id);
    }
    dibujarTabla();
  });

  cajaBotones.appendChild(boton);
});


/* ---------- 3. ARMAR LA TABLA ---------- */
function dibujarTabla() {
  // marco los botones elegidos
  cajaBotones.querySelectorAll("button").forEach(function (b) {
    const estaElegida = elegidas.includes(b.dataset.id);
    b.classList.toggle("activa", estaElegida);
    b.setAttribute("aria-pressed", estaElegida);
  });

  // si hay menos de 2 elegidas no hay nada que comparar
  if (elegidas.length < 2) {
    resultado.innerHTML = '<p style="padding:24px 28px">Elegí al menos <strong>dos metodologías</strong> para ver la comparación.</p>';
    return;
  }

  // tomo los datos de las elegidas, en el mismo orden que los botones
  const columnas = metodologias.filter(function (m) {
    return elegidas.includes(m.id);
  });

  // la fila de arriba: los nombres
  let html = '<table class="tabla"><thead><tr><th scope="col"><span class="visually-hidden">Característica</span></th>';
  columnas.forEach(function (m) {
    html += '<th scope="col">' + m.nombre + "</th>";
  });
  html += "</tr></thead><tbody>";

  // una fila por cada característica
  filas.forEach(function (fila, i) {
    html += '<tr style="animation-delay:' + (i * 0.05) + 's"><th scope="row">' + fila.titulo + "</th>";
    columnas.forEach(function (m) {
      html += "<td>" + m[fila.dato] + "</td>";
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  resultado.innerHTML = html;
}


/* ---------- 4. ARRANCO ---------- */
dibujarTabla();
