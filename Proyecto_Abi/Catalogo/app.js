const inputBusqueda = document.getElementById("buscador");
const contenedorCategorias = document.getElementById("categorias");
const contenedorProductos = document.getElementById("productos");
 
let Productos = [];
let categoriasSeleccionada = "all";
 
//LOGICA LOGIN y PRODUCTOS
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
 
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
 
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const mensaje = document.getElementById("mensaje");
            try {
                const response = await fetch("https://fakestoreapi.com/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                });
 
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }
 
                const data = await response.json();
                localStorage.setItem("token", data.token);
                mensaje.textContent = "Inicio de sesión exitoso";
                mensaje.classList.add("text-green-500");
 
                setTimeout(() => {
                    window.location.href = "index.html"; // Redirigir a la página principal
                }, 1500);
               
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
                mensaje.textContent = "Error al iniciar sesión. Verifica tus credenciales.";                
                mensaje.classList.add("text-red-500");
            }
        });
    } if (contenedorProductos && contenedorCategorias && inputBusqueda) {
    // Si los elementos existen, se ejecuta la lógica de productos
    cargarProductos();
    cargarCategorias();
 
    //Agregar evento de búsqueda
    inputBusqueda.addEventListener("input", filtrarProductos);
    }
});
 
//LOGICA DE PRODUCTOS
async function cargarProductos() {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products");
 
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }
 
        const productos = await respuesta.json();
 
        if (productos.length === 0) {
            console.log("No hay productos disponibles.");
        } else {
            Productos = productos; // Guardar los productos en la variable global
            mostrarProductos(productos); // Mostrar los productos en la interfaz de usuario
        }
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}
 
async function cargarCategorias() {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products/categories");
 
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }
 
        const categorias = await respuesta.json();
        mostrarCategorias(["all", ...categorias]); // Agregar "all" como opción predeterminada
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}
 
function filtrarProductos() {
    let filtrados = Productos;
 
    // Filtrar por categoría
    if (categoriasSeleccionada !== "all") {
        filtrados = filtrados.filter((p) => p.category === categoriasSeleccionada);
    }
 
    // Filtrar por texto de búsqueda
    const texto = inputBusqueda.value.toLowerCase();
    if (texto.trim() !== "") {
        filtrados = filtrados.filter(
            (p) =>
                p.title.toLowerCase().includes(texto) ||
                p.description.toLowerCase().includes(texto)
        );
    }
 
    mostrarProductos(filtrados); // Mostrar los productos filtrados
}
 
function mostrarCategorias(categorias) {
    contenedorCategorias.innerHTML = ""; // Limpiar el contenedor de categorías

    categorias.forEach((cat) => {
        const btn = document.createElement("button");
        btn.textContent = cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.dataset.categoria = cat; // Guarda el valor real

        // Usa solo la clase personalizada
        btn.className = "categoria-btn" + (categoriasSeleccionada === cat ? " categoria-btn-activa" : "");
        btn.classList.add('btn-abi'); // para botones generales
        // o
        btn.classList.add('categoria-btn'); // para botones de categoría

        btn.addEventListener("click", () => {
            categoriasSeleccionada = cat; // Usa el valor real, no el texto mostrado
            mostrarCategorias(categorias); // Actualizar los estilos de los botones
            filtrarProductos(); // Filtrar los productos según la categoría seleccionada
        });

        contenedorCategorias.appendChild(btn);
    });
}
 
// Mostrar productos SOLO con imagen y título (para "Catálogo")
function mostrarProductosInicio(productos) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';
  productos.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'bg-[rgba(53,41,28,0.85)] rounded-2xl shadow-lg p-6 border-2 border-[#3e3d32] flex flex-col items-center';
    div.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" class="h-32 mb-4 object-contain bg-[#232323] rounded-lg p-4" />
      <h3 class="text-lg font-bold text-[#e6db74] mb-2 text-center">${producto.title}</h3>
      <a href="detalle.html?id=${producto.id}" class="btn-abi mt-2">Ver detalles</a>
    `;
    contenedor.appendChild(div);
  });
}

// Mostrar productos con detalles (para "Detalles")
function mostrarProductosDetalles(productos) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';
  productos.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'bg-[rgba(53,41,28,0.85)] rounded-2xl shadow-lg p-6 border-2 border-[#3e3d32] flex flex-col items-center';
    div.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" class="h-32 mb-4 object-contain bg-[#232323] rounded-lg p-4" />
      <h3 class="text-lg font-bold text-[#e6db74] mb-2 text-center">${producto.title}</h3>
      <p class="text-[#a6e22e] font-bold text-xl mb-2">$${producto.price}</p>
      <p class="text-[#f8f8f2] text-sm mb-2 text-center">${producto.description.substring(0, 80)}...</p>
      <a href="detalle.html?id=${producto.id}" class="btn-abi mt-2">Ver detalles</a>
    `;
    contenedor.appendChild(div);
  });
}

// Control de vista actual: "inicio" o "detalles"
let vistaActual = "detalles"; // Por defecto muestra detalles

// Cambia la vista y actualiza productos y título
function cambiarVista(vista) {
  vistaActual = vista;
  document.querySelector('h2').textContent = vista === "inicio" ? "Catálogo de Productos" : "Detalles de Productos";
  if (vista === "inicio") {
    mostrarProductosInicio(Productos);
  } else {
    mostrarProductosDetalles(Productos);
  }
}

// Función puente para mostrar según la vista actual
function mostrarProductos(productos) {
  if (vistaActual === "inicio") {
    mostrarProductosInicio(productos);
  } else {
    mostrarProductosDetalles(productos);
  }
}

// Asigna eventos a las opciones del menú hamburguesa
document.addEventListener('DOMContentLoaded', () => {
  const menuOpciones = document.getElementById('menu-opciones');
  if (menuOpciones) {
    const opcionInicio = menuOpciones.querySelector('a[data-vista="inicio"]');
    const opcionDetalles = menuOpciones.querySelector('a[data-vista="detalles"]');
    if (opcionInicio) {
      opcionInicio.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista("inicio");
        menuOpciones.classList.add('hidden');
      });
    }
    if (opcionDetalles) {
      opcionDetalles.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarVista("detalles");
        menuOpciones.classList.add('hidden');
      });
    }
  }
});

// Cuando se cargan los productos, muestra según la vista actual
async function cargarProductos() {
  try {
    const respuesta = await fetch("https://fakestoreapi.com/products");
    if (!respuesta.ok) throw new Error("Error en la respuesta de la API");
    const productos = await respuesta.json();
    Productos = productos;
    cambiarVista(vistaActual);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}
cargarProductos();

inputBusqueda.addEventListener("input", filtrarProductos);

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn && localStorage.getItem('token')) {
  logoutBtn.classList.remove('hidden');
}
logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});

// Tiempo de inactividad en milisegundos (5 minutos)
const TIEMPO_INACTIVIDAD = 3 * 60 * 1000;
let inactividadTimeout;

// Función para cerrar sesión por inactividad
function cerrarPorInactividad() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Reinicia el temporizador de inactividad
function reiniciarInactividad() {
  clearTimeout(inactividadTimeout);
  inactividadTimeout = setTimeout(cerrarPorInactividad, TIEMPO_INACTIVIDAD);
}

// Eventos que reinician el temporizador
['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evento => {
  window.addEventListener(evento, reiniciarInactividad);
});

// Iniciar el temporizador al cargar la página
reiniciarInactividad();

// Menú hamburguesa funcional
const menuBtn = document.getElementById('menu-btn');
const menuOpciones = document.getElementById('menu-opciones');

if (menuBtn && menuOpciones) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOpciones.classList.toggle('hidden');
  });

  // Cierra el menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!menuOpciones.contains(e.target) && !menuBtn.contains(e.target)) {
      menuOpciones.classList.add('hidden');
    }
  });
}

// Redirigir a login si no hay token
if (!localStorage.getItem('token')) {
  window.location.href = 'login.html';
}

