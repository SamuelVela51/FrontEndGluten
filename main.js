const buscador = document.querySelector(".buscar");
const contenedorProductos = document.querySelector(".contenedor-productos");

let productosArray = []; // Array para almacenar productos cargados

// Cargar productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  fetchProductos();
});

// Función para obtener los productos desde el backend
function fetchProductos() {
  fetch("https://serverbackend.freegluten.site/api/v1/productos/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      return response.json();
    })
    .then((data) => {
      mostrarProductos(data);
      productosArray = data; // Almacenar los productos en la variable global
    })
    .catch((error) => console.error("Error:", error));
}

// Función para mostrar productos
function mostrarProductos(data) {
  const productosDiv = document.querySelector(".productos");
  productosDiv.innerHTML = ""; // Limpiar productos previos

  data.forEach((producto) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("producto");

    // Configuración de truncamiento
    const maxDescripcionLength = 200; // Caracteres máximos para truncar
    let descripcionTruncada = producto.descripcion;

    // Verificar si la descripción es larga
    if (producto.descripcion.length > maxDescripcionLength) {
      descripcionTruncada = `${producto.descripcion.slice(
        0,
        maxDescripcionLength
      )}... <span class="leer-mas">Leer más</span>`;
    }

    tarjeta.innerHTML = `
  <div class="resolucion">
      <img class="imagenproducto" src="${producto.imagen_url}" alt="${
      producto.nombre
    }" />
      <div class="producto-container">
          <div class="descripcion">
              <h3 class="nombreproducto">${producto.nombre}</h3>
              <h5 class="descripcionproducto">
                  <span class="texto-corto">${descripcionTruncada}</span>
                  <span class="texto-completo oculto">${
                    producto.descripcion
                  } <span class="leer-menos">Leer menos</span></span>
              </h5>
              <h4 class="precioproducto">$ ${producto.precio.toLocaleString(
                "es-CO"
              )}</h4>
              <button class="agregar-carrito" data-nombre="${
                producto.nombre
              }" data-precio="${producto.precio}" data-imagen="${
      producto.imagen_url
    }">Agregar al carrito</button>
          </div>
      </div>
  </div>
`;

    productosDiv.appendChild(tarjeta);
  });

  // Configurar evento para manejar "Leer más" y "Leer menos"
  configurarLeerMas();

  // Configurar evento para agregar al carrito
  configurarBotonesAgregarAlCarrito();
}

// Función para manejar "Leer más" y "Leer menos"
function configurarLeerMas() {
  const textosLeerMas = document.querySelectorAll(".leer-mas");
  textosLeerMas.forEach((texto) => {
    texto.addEventListener("click", (e) => {
      const descripcion = e.target.closest(".descripcion");
      const textoCorto = descripcion.querySelector(".texto-corto");
      const textoCompleto = descripcion.querySelector(".texto-completo");

      // Mostrar el texto completo y ocultar el truncado
      textoCorto.classList.add("oculto");
      textoCompleto.classList.remove("oculto");
    });
  });

  const textosLeerMenos = document.querySelectorAll(".leer-menos");
  textosLeerMenos.forEach((texto) => {
    texto.addEventListener("click", (e) => {
      const descripcion = e.target.closest(".descripcion");
      const textoCorto = descripcion.querySelector(".texto-corto");
      const textoCompleto = descripcion.querySelector(".texto-completo");

      // Mostrar el texto truncado y ocultar el completo
      textoCorto.classList.remove("oculto");
      textoCompleto.classList.add("oculto");
    });
  });
}

// Función para configurar los botones "Agregar al carrito"
function configurarBotonesAgregarAlCarrito() {
  document.querySelectorAll(".agregar-carrito").forEach((button) => {
    button.addEventListener("click", function () {
      const nombre = this.getAttribute("data-nombre");
      const precio = parseFloat(this.getAttribute("data-precio"));
      const imagen = this.getAttribute("data-imagen");

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const productoExistente = carrito.find((item) => item.nombre === nombre);
      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        carrito.push({
          nombre: nombre,
          precio: precio,
          cantidad: 1,
          imagen: imagen,
        });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      Swal.fire({
        title: "Producto agregado",
        text: `El producto "${nombre}" se ha agregado al carrito exitosamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#714212",
        background: "#f9f9f9",
        color: "#333",
        iconColor: "#714212",
      });
    });
  });
}

// Añadir evento de búsqueda al escribir en el cuadro
buscador.addEventListener("keyup", realizarBusqueda);

// Función para realizar la búsqueda
function realizarBusqueda() {
  const terminoBusqueda = buscador.value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Filtrar productos en base al término de búsqueda
  const productosCoincidentes = productosArray.filter((producto) => {
    return producto.nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(terminoBusqueda);
  });

  // Mostrar productos coincidentes
  mostrarProductos(productosCoincidentes);
}

//abrir el model de las tarjetas de recetas

function openModal(title, imgSrc, description) {
  // Asignar los valores a los elementos del modal
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-img").src = imgSrc;
  document.getElementById("modal-description").innerText = description;

  // Mostrar el modal
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  // Ocultar el modal
  document.getElementById("modal").style.display = "none";
}

// Cerrar el modal si se hace clic fuera del contenido del modal
window.onclick = function (event) {
  var modal = document.getElementById("modal");
  if (event.target == modal) {
    closeModal();
  }
};















document.addEventListener("DOMContentLoaded", () => {
  const formularioComentario = document.getElementById("formulario-comentario");
  const listaComentarios = document.getElementById("lista-comentarios");
  const estrellas = document.querySelectorAll("#calificacion .estrella");
  let calificacionSeleccionada = 0;

  // Cargar comentarios del localStorage
  const cargarComentarios = () => {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    listaComentarios.innerHTML = "";
    comentarios.forEach((comentario) => {
      const div = document.createElement("div");
      div.classList.add("comentario");
      div.innerHTML = `
        <strong>${comentario.nombre}</strong>:
        <div>${crearEstrellasHTML(comentario.calificacion)}</div>
        <p>${comentario.texto}</p>
      `;
      listaComentarios.appendChild(div);
    });
  };

  // Crear HTML de las estrellas según la calificación
  const crearEstrellasHTML = (calificacion) => {
    let estrellasHTML = "";
    for (let i = 1; i <= 5; i++) {
      if (calificacion >= i) {
        estrellasHTML += '<span class="estrella seleccionada">★</span>'; // Estrella dorada
      } else {
        estrellasHTML += '<span class="estrella">★</span>'; // Estrella gris
      }
    }
    return estrellasHTML;
  };

  cargarComentarios();

  // Manejar selección de estrellas
  estrellas.forEach((estrella, index) => {
    estrella.addEventListener("mousemove", (e) => {
      const rect = estrella.getBoundingClientRect();
      const x = e.clientX - rect.left; // Coordenada X dentro de la estrella
      const isHalf = x < rect.width / 2;
      estrellas.forEach((star, i) => {
        star.classList.toggle(
          "seleccionada",
          i < index || (i === index && !isHalf)
        );
        star.classList.toggle("media", i === index && isHalf);
      });
    });

    estrella.addEventListener("click", (e) => {
      const rect = estrella.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isHalf = x < rect.width / 2;
      calificacionSeleccionada = index + (isHalf ? 0.5 : 1);
    });

    estrella.addEventListener("mouseleave", () => {
      estrellas.forEach((star, i) => {
        star.classList.toggle("seleccionada", i < calificacionSeleccionada);
        star.classList.toggle("media", calificacionSeleccionada - i === 0.5);
      });
    });
  });

  // Manejar envío del formulario
  formularioComentario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const comentario = document.getElementById("comentario").value;

    if (!calificacionSeleccionada) {
      alert("Por favor, selecciona una calificación.");
      return;
    }

    const nuevoComentario = {
      nombre,
      texto: comentario,
      calificacion: calificacionSeleccionada,
    };

    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentarios.push(nuevoComentario);
    localStorage.setItem("comentarios", JSON.stringify(comentarios));

    // Resetear formulario
    formularioComentario.reset();
    estrellas.forEach((star) => star.classList.remove("seleccionada", "media"));
    calificacionSeleccionada = 0;

    // Recargar comentarios
    cargarComentarios();
  });
});
