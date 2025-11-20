const productos = {
    favoritos: [
        { nombre: "Hot Dog Clásico", precio: "$3.50", imagen: "hotdog" },
        { nombre: "Coca Cola Mediana", precio: "$2.00", imagen: "cocacola" },
        { nombre: "Palomitas Pequeñas", precio: "$2.50", imagen: "palomitamediana" },
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

    // Si no existe la categoría, mostrar mensaje
    if (!productos[categoria] || productos[categoria].length === 0) {
        productosContainer.innerHTML = `<p style="color: white; text-align: center;">No hay productos en la categoría seleccionada</p>`;
        mensaje.style.opacity = "0";
        productosContainer.classList.add("visible");
        return;
    }

    productos[categoria].forEach(producto => {
        const productoDiv = document.createElement("div");
        productoDiv.className = "producto";
        const imagenProducto = producto.imagen && producto.imagen !== 'default' ? `IMG/${producto.imagen}.jpg` : 'IMG/default.jpg';
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

// Cargar productos guardados en localStorage y fusionarlos con los por defecto
function loadLocalProducts() {
    try {
        const STORAGE_KEY = 'dulceriaProducts';
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const stored = JSON.parse(raw);
        Object.keys(stored).forEach(cat => {
            // Normalizar clave a minúsculas
            const key = cat.toLowerCase();
            if (!productos[key]) productos[key] = [];
            // push each saved product (evitar mutar referencias externas)
            stored[cat].forEach(p => productos[key].push(p));
        });
    } catch (err) {
        console.error('Error cargando productos desde localStorage:', err);
    }
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
    // Cargar productos añadidos desde el panel (localStorage)
    loadLocalProducts();

    // Si existe una categoría guardada, activarla; si no, activar la primera
    const lastCat = localStorage.getItem('dulceriaLastCategory');
    let activated = false;
    if (lastCat) {
        const btn = document.querySelector(`.categoria[data-category="${lastCat}"]`);
        if (btn) {
            btn.classList.add('active');
            mostrarProductos(lastCat);
            activated = true;
        }
    }

    if (!activated) {
        // activar la primera categoría visualmente y mostrar su contenido
        const firstBtn = document.querySelector('.categoria');
        if (firstBtn) {
            firstBtn.classList.add('active');
            const firstCat = firstBtn.dataset.category;
            mostrarProductos(firstCat);
        }
    }

    mensaje.style.opacity = "1";
});