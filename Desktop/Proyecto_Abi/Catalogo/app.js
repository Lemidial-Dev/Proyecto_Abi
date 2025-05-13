const contenedorProductos = document.getElementById("productos");
const inputBusqueda = document.getElementById("buscador");
const contenedorCategorias = document.getElementById("categorias"); // Corregido

let productos = []; // Variable global
let categorias = []; // Agregado
let categoriaSeleccionada = "all"; // Variable para almacenar la categoría seleccionada

async function cargarProductos() {
    try {
       const respuesta = await fetch("https://fakestoreapi.com/products");

       if (!respuesta.ok) {
           throw new Error("Error en la respuesta de la API");
       }
       productos = await respuesta.json();

       if (productos.length === 0) {
           console.log("No se encontraron productos");
       } else {
           mostrarProductos(productos);
       }
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

async function cargarProducto(id) {
    try {
        const respuesta = await fetch(`https://fakestoreapi.com/products/${id}`);

        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }
        const producto = await respuesta.json();
        //mostrarCategorias(producto.category);
    } catch (error) {
        console.error("Error al cargar el producto:", error);
    } 
}

async function cargarCategorias() { // Agregado
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products/categories");
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }
        categorias = await respuesta.json();
        categorias.unshift("all"); // Agrega opción "Todos"
        mostrarCategorias(categorias);
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}

async function mostrarCategorias(categorias) {
    contenedorCategorias.innerHTML = "";//Limpiar el contenedor antes de mostrar las categorías

    categorias.forEach((cat) => { // Corregido
        const btn = document.createElement("button");
        btn.textContent = cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.className = `px-4 py-2 rounded-full ${categoriaSeleccionada === cat ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500"} hover:bg-blue-500 hover:text-white transition-colors duration-300`; // Corregido

        btn.addEventListener("click", () => {
            categoriaSeleccionada = cat;
            filtraProductos();
            mostrarCategorias(categorias);
        });
        contenedorCategorias.appendChild(btn); // Corregido: debe estar dentro del forEach
    });
}

function filtraProductos() {
    let filtrados = productos;
    const texto = inputBusqueda.value.toLowerCase();
    if (categoriaSeleccionada !== "all") {
        filtrados = filtrados.filter((p) => p.category === categoriaSeleccionada);
    }
    if (texto.trim() !== "") {
        filtrados = filtrados.filter((p) =>
            p.title.toLowerCase().includes(texto) ||
            p.description.toLowerCase().includes(texto)
        );
    }
    mostrarProductos(filtrados); // Mostrar los productos filtrados
}

function mostrarProductos(productosAMostrar) {
    contenedorProductos.innerHTML = "";
    productosAMostrar.forEach((producto) => {
        const productoDIV = document.createElement("div");
        productoDIV.className =
            "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";
        productoDIV.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 object-contain mb-4">
            <h3 class="font-bold text-lg mb-2">${producto.title}</h3>
            <p class="text-gray-600 mb-2">${producto.description.substring(0, 60)}...</p>
            <span class="text-blue-600 font-bold text-xl">$${producto.price}</span>
        `;
        contenedorProductos.appendChild(productoDIV);
    });
}

inputBusqueda.addEventListener("input", filtraProductos);

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    cargarCategorias();
});
