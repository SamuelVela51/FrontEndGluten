// Función para mostrar los productos (solo los más recientes)
function mostrarProductos(data) {
  const productosDiv = document.querySelector(".contenedor-productos");
  productosDiv.innerHTML = ""; // Limpiar productos previos

  // Ordenar los productos por fecha de creación (suponiendo que la propiedad es 'fecha_creacion')
  const productosOrdenados = data.sort(
    (a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
  );

  // Tomar solo los primeros 5 productos
  const productosNuevos = productosOrdenados.slice(0, 5);

  productosNuevos.forEach((producto) => {
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
          <img class="imagenproducto" src="${producto.imagen_url}" alt="${producto.nombre}" />
          <div class="producto-container">
              <div class="descripcion">
                  <h3 class="nombreproducto">${producto.nombre}</h3>
                  <h5 class="descripcionproducto">
                      <span class="texto-corto">${descripcionTruncada}</span>
                      <span class="texto-completo oculto">${producto.descripcion} <span class="leer-menos">Leer menos</span></span>
                  </h5>
              </div>
          </div>
      </div>
    `;

    productosDiv.appendChild(tarjeta);
  });

  // Configurar evento para manejar "Leer más" y "Leer menos"
  configurarLeerMas();
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
      if (textoCorto && textoCompleto) {
        textoCorto.style.display = "none";
        textoCompleto.style.display = "inline";
      }
    });
  });

  const textosLeerMenos = document.querySelectorAll(".leer-menos");
  textosLeerMenos.forEach((texto) => {
    texto.addEventListener("click", (e) => {
      const descripcion = e.target.closest(".descripcion");
      const textoCorto = descripcion.querySelector(".texto-corto");
      const textoCompleto = descripcion.querySelector(".texto-completo");

      // Mostrar el texto truncado y ocultar el completo
      if (textoCorto && textoCompleto) {
        textoCorto.style.display = "inline";
        textoCompleto.style.display = "none";
      }
    });
  });
}
