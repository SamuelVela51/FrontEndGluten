// Array para almacenar los productos agregados al carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para cargar el carrito al iniciar la página
function cargarCarrito() {
  if (carrito) {
    mostrarCarrito();
  }
}

// Función para mostrar el carrito con tarjetas
function mostrarCarrito() {
  const contenedor = document.querySelector(".productos-container");
  if (!contenedor) return; // Asegúrate de que el contenedor existe
  contenedor.innerHTML = ""; // Limpiar el contenedor

  let totalCarrito = 0;

  carrito.forEach((producto, index) => {
    const total = producto.precio * producto.cantidad;
    totalCarrito += total;

    const tarjeta = `
            <div class="card mb-3" style="max-width: 18rem;">
                <div class="card-body">
                    <img src="${producto.imagen}" alt="${
      producto.nombre
    }" class="img-fluid" />
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Precio: $${parseFloat(
                      producto.precio
                    ).toFixed(2)}</p>
                    <p class="card-text">Cantidad: 
                        <button class="btn btn-sm btn-outline-secondary disminuir-cantidad" data-index="${index}">-</button>
                        ${producto.cantidad}
                        <button class="btn btn-sm btn-outline-secondary aumentar-cantidad" data-index="${index}">+</button>
                    </p>
                    <p class="card-text">Total: $${total.toFixed(2)}</p>
                    <button class="btn btn-danger btn-sm eliminar-producto" data-index="${index}">Eliminar</button>
                </div>
            </div>
        `;

    contenedor.innerHTML += tarjeta;
  });

  document.querySelector(
    "#totalCarrito"
  ).textContent = `$${totalCarrito.toFixed(2)}`;

  // Añadir eventos a los botones de aumentar y disminuir cantidad, y eliminar
  document.querySelectorAll(".aumentar-cantidad").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      incrementarCantidad(index);
    });
  });

  document.querySelectorAll(".disminuir-cantidad").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      disminuirCantidad(index);
    });
  });

  document.querySelectorAll(".eliminar-producto").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      eliminarProducto(index);
    });
  });
}

// Funciones para incrementar, disminuir y eliminar producto
function incrementarCantidad(index) {
  carrito[index].cantidad++;
  guardarCarrito();
  mostrarCarrito();
}

function disminuirCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    eliminarProducto(index);
  }
  guardarCarrito();
  mostrarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Evento al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito(); // Cargar el carrito al iniciar la página
  fetchProductos(); // Cargar productos disponibles
});

// Mostrar productos en pantalla
function mostrarProductos(data) {
  const productosDiv = document.querySelector(".productos");
  if (!productosDiv) return; // Asegúrate de que el contenedor existe
  productosDiv.innerHTML = ""; // Limpiar productos previos

  data.forEach((producto) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("producto");

    tarjeta.innerHTML = `
            <div class="resolucion">
                <img class="imagenproducto" src="${producto.imagen_url}" alt="${
      producto.nombre
    }" />
                <div class="producto-container">
                    <div class="descripcion">
                        <h3 class="nombreproducto">${producto.nombre}</h3>
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

  // Evento para agregar productos al carrito
  document.querySelectorAll(".agregar-carrito").forEach((button) => {
    button.addEventListener("click", function () {
      const nombre = this.getAttribute("data-nombre");
      const precio = parseFloat(this.getAttribute("data-precio"));
      const imagen = this.getAttribute("data-imagen"); // Obtener la imagen

      const productoExistente = carrito.find((item) => item.nombre === nombre);
      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        carrito.push({
          nombre: nombre,
          precio: precio,
          cantidad: 1,
          imagen: imagen,
        }); // Añadir la imagen
      }

      guardarCarrito();
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

// Fetch productos del backend
function fetchProductos() {
  
  http: fetch("https://serverbackend.freegluten.site/api/v1/productos/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      return response.json();
    })
    .then((data) => {
      mostrarProductos(data);
    })
    .catch((error) => console.error("Error:", error));
}

// Paypal
// Configurar el botón de PayPal
paypal
  .Buttons({
    // Función para crear la transacción
    createOrder: function (data, actions) {
      const totalCarrito = carrito.reduce(
        (acc, producto) => acc + producto.precio * producto.cantidad,
        0
      );
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: totalCarrito.toFixed(2), // Total del carrito
            },
          },
        ],
      });
    },
    // Función para ejecutar el pago
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        // Mostrar un mensaje de éxito
        Swal.fire({
          title: "Pago realizado con éxito!",
          text: `Gracias, ${details.payer.name.given_name}. Tu pedido ha sido procesado.`,
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#714212",
          background: "#f9f9f9",
          color: "#333",
          iconColor: "#714212",
        });
        // Limpiar el carrito
        carrito = []; // Vaciar el carrito
        guardarCarrito(); // Guardar cambios en localStorage
        mostrarCarrito(); // Actualizar la vista del carrito
      });
    },
    // Función para manejar errores
    onError: function (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Hubo un problema al procesar tu pago.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#714212",
        background: "#f9f9f9",
        color: "#333",
        iconColor: "#714212",
      });
    },
  })
  .render("#paypal-button-container"); // Renderiza el botón en el contenedor
