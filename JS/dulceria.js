const productos = {
    favoritos: [
        { nombre: "Hot Dog Clásico", precio: "$3.50", imagen: "hotdog" },
        { nombre: "Coca Cola Mediana", precio: "$2.00", imagen: "cocacola" },
        { nombre: "Palomitas Pequeñas", precio: "$2.50", imagen: "palomitas" },
    ],
    combos: [
        { nombre: "Combo Hot Dog", precio: "$5.50", imagen: "hotdog" },
        { nombre: "Combo Palomitas", precio: "$5.00", imagen: "hotdogcombo" },
        { nombre: "Combo snacks", precio: "$7.00", imagen: "snakscombo" }
    ],
    palomitas: [
        { nombre: "Palomitas Saladas", precio: "$2.50", imagen: "palomitasSaladas" },
        { nombre: "Palomitas Dulces", precio: "$2.75", imagen: "palomitasDulces" },
        { nombre: "Palomitas Queso", precio: "$3.00", imagen: "palomitasQueso" }
    ],
    bebidas: [
        { nombre: "Fuze Tea", precio: "$2.25", imagen: "fuze" },
        { nombre: "Agua embotellada", precio: "$1.50", imagen: "agua" },
        { nombre: "Soda", precio: "$2.00", imagen: "soda" }
    ],
    snacks: [
        { nombre: "Papitas", precio: "$4.00", imagen: "papitas" },
        { nombre: "Nachos con Queso", precio: "$3.50", imagen: "nachos" },
        { nombre: "Dulces", precio: "$2.75", imagen: "dulces" }
    ],
    chocolates: [
        { nombre: "Chocolate Negro", precio: "$1.75", imagen: "chocolateNegro" },
        { nombre: "Chocolate Blanco", precio: "$1.75", imagen: "chocolateBlanco" },
        { nombre: "Chocolate con Leche", precio: "$1.75", imagen: "chocolateLeche" }
    ]
};

const listaCategorias = document.querySelector(".listaCategorias");
const panelProductos = document.getElementById("panel-productos");
const productosContainer = document.getElementById("contenedor-productos");
const mensaje = document.getElementById("mensaje");

function mostrarProductos(categoria) {
    productosContainer.innerHTML = "";

    productos[categoria].forEach(producto => {
        const productoDiv = document.createElement("div");
        productoDiv.className = "producto";
        const imagenProducto = `IMG/${producto.imagen}.jpg`;
        productoDiv.innerHTML = `
        <img src = "${imagenProducto}" alt = "${producto.nombre}" class = "productoImagen">
        <span>${producto.nombre}<br><strong>${producto.precio}</strong></span>
    `;    
        productoDiv.querySelector('img').onerror = function() {
            this.src = 'IMG/default.jpg';
            this.alt = 'Imagen no disponible';
        };
        
        productosContainer.appendChild(productoDiv);
    });

    mensaje.style.opacity = "0";
    productosContainer.classList.add("visible");
}

listaCategorias.addEventListener("click", (e) => {
    if (e.target.classList.contains("categoria")) {
        const categoria = e.target.dataset.category;

        document.querySelectorAll(".categoria").forEach(cat => cat.classList.remove("active"));

        e.target.classList.add("active");

        mostrarProductos(categoria);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    mensaje.style.opacity = "1";
});