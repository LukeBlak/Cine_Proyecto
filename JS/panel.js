// js/panel.js
import { auth } from './firebase-config.js';
import { registerUser, signOut } from './service/authService.js';
import { saveMovie, getMovies } from './service/moviesService.js';

// Verificar autenticación
document.addEventListener('DOMContentLoaded', function() {
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    const userUID = sessionStorage.getItem('userUID');

    console.log("=== VERIFICANDO SESIÓN ===");
    console.log("Rol:", userRole);
    console.log("Nombre:", userName);
    console.log("UID:", userUID);

    // Redirigir si no hay sesión
    if (!userRole || !userName || !userUID) {
        console.log("❌ No hay sesión activa, redirigiendo a login...");
        window.location.href = "index.html";
        return;
    }

    // Mostrar información del usuario
    document.getElementById('userName').textContent = userName;
    
    // Verificar si es admin y mostrar el rol correcto
    if (userRole === 'Admin' || userRole === 'admin') {
        console.log("✅ Usuario es ADMIN");
        document.getElementById('userRole').textContent = 'Administrador General';
        
        // Mostrar sección de admin
        const adminSection = document.getElementById('adminSection');
        if (adminSection) {
            adminSection.style.display = 'block';
            console.log("✅ Sección de admin visible");
        }
        
        // Cargar datos iniciales solo si es admin (por ejemplo, la lista de películas)
        loadMovies();
        
    } else {
        // Si no es admin, se puede redirigir o limitar funcionalidades, pero por ahora solo muestra el rol
        document.getElementById('userRole').textContent = 'Empleado';
        console.log("✅ Usuario es Empleado, acceso limitado/sólo visualización");
    }

    // Inicializar listeners de los formularios
    initializeForms();
    initializeTabs();
});

// Inicializar pestañas de navegación
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Desactivar todas las pestañas y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activar la pestaña y el contenido seleccionados
            button.classList.add('active');
            const targetId = button.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');

            // Cargar datos específicos al cambiar de pestaña si es necesario
            if (targetId === 'peliculas') {
                loadMovies();
            }
            // Aquí se pueden agregar más llamadas para cargar promociones o productos de dulcería
        });
    });

    // Activar la primera pestaña por defecto al cargar
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}

// Inicializar formularios de administración
function initializeForms() {
    // 1. Formulario de Películas
    const movieForm = document.getElementById('movieForm');
    if (movieForm) {
        movieForm.addEventListener('submit', handleSaveMovie);
    }
    
    // 2. Formulario de Promociones
    const promotionForm = document.getElementById('promotionForm');
    if (promotionForm) {
        promotionForm.addEventListener('submit', handleSavePromotion);
    }
    
    // 3. Formulario de Productos de Dulcería
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleSaveProduct);
    }
}

// === HANDLERS DE FORMULARIOS ===

// Manejar el guardado de películas
async function handleSaveMovie(e) {
    e.preventDefault();
    
    const title = document.getElementById('movieTitle').value;
    const genre = document.getElementById('movieGenre').value;
    const duration = document.getElementById('movieDuration').value;
    const description = document.getElementById('movieSynopsis').value;
    const startDate = document.getElementById('movieStartDate').value;
    const endDate = document.getElementById('movieEndDate').value;
    const director = document.getElementById('movieDirector').value;
    const image = document.getElementById('movieImage').value;

    const movieData = {
        title,
        genre,
        duration: parseInt(duration), // Convertir a número
        description,
        startDate,
        endDate,
        director,
        image
    };

    const success = await saveMovie(movieData);

    if (success) {
        alert('✅ Película guardada exitosamente');
        document.getElementById('movieForm').reset();
        loadMovies(); // opcional: recargar lista en panel
    } else {
        alert('❌ Error al guardar película');
    }
}

// Manejar el guardado de promociones como producto (se guardan en la categoría "combos" para aparecer en dulcería)
function handleSavePromotion(e) {
    e.preventDefault();

    const title = document.getElementById('promotionTitle')?.value?.trim() || 'Promoción';
    const description = document.getElementById('promotionDescription')?.value?.trim() || '';
    const discount = document.getElementById('promotionDiscount')?.value;
    const endDate = document.getElementById('promotionEndDate')?.value;

    // Convertir descuento a representación de precio/etiqueta (ej. "20% OFF")
    const precioLabel = discount ? `${parseFloat(discount)}% OFF` : '';

    const productData = {
        nombre: title,
        precio: precioLabel || '—',
        imagen: 'default', // sin imagen por ahora
        descripcion: description,
        // campos adicionales que quieras conservar
        meta: {
            tipo: 'promocion',
            endDate: endDate || null
        }
    };

    try {
        const STORAGE_KEY = 'dulceriaProducts';
        const raw = localStorage.getItem(STORAGE_KEY);
        const stored = raw ? JSON.parse(raw) : {};

        const catKey = 'combos';
        if (!stored[catKey]) stored[catKey] = [];
        stored[catKey].push(productData);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        // marcar última categoría para que dulcería la active automáticamente
        localStorage.setItem('dulceriaLastCategory', catKey);

        alert('✅ Promoción guardada como producto en la categoría "combos"');
        document.getElementById('promotionForm').reset();
    } catch (err) {
        console.error('Error guardando promoción en localStorage:', err);
        alert('❌ Error al guardar promoción');
    }
}

// Normalizar categorías para que coincidan con las keys de dulceria.js
function normalizeCategory(input) {
    const map = {
        'bebida': 'bebidas',
        'bebidas': 'bebidas',
        'combo': 'combos',
        'combos': 'combos',
        'palomita': 'palomitas',
        'palomitas': 'palomitas',
        'snack': 'snacks',
        'snacks': 'snacks',
        'dulce': 'snacks',
        'dulceria': 'snacks',
        'chocolate': 'chocolates',
        'chocolates': 'chocolates',
        'favorito': 'favoritos',
        'favoritos': 'favoritos',
        'otros': 'otros'
    };
    const key = (input || '').trim().toLowerCase();
    return map[key] || key || 'otros';
}

// Manejar el guardado de productos de dulcería (guarda en localStorage)
async function handleSaveProduct(e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const priceValue = document.getElementById('productPrice').value;
    const stockValue = document.getElementById('productStock').value;
    const rawCategory = document.getElementById('productCategory').value;

    const catKey = normalizeCategory(rawCategory);

    const price = isNaN(parseFloat(priceValue)) ? priceValue : `$${parseFloat(priceValue).toFixed(2)}`;

    const productData = {
        nombre: name || 'Sin nombre',
        precio: price,
        imagen: 'default', // puedes agregar campo para URL/filename si lo deseas
        descripcion: description || '',
        stock: stockValue ? parseInt(stockValue, 10) : 0
    };

    try {
        const STORAGE_KEY = 'dulceriaProducts';
        const raw = localStorage.getItem(STORAGE_KEY);
        const stored = raw ? JSON.parse(raw) : {};

        if (!stored[catKey]) stored[catKey] = [];
        stored[catKey].push(productData);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        localStorage.setItem('dulceriaLastCategory', catKey);

        alert('✅ Producto guardado localmente en la categoría: ' + catKey);
        document.getElementById('productForm').reset();

        // Opcional: si estás en el panel y quieres que la dulcería refleje de inmediato en otra pestaña,
        // los cambios quedan en localStorage; al abrir dulceria.html o recargarla se mostrarán.
    } catch (err) {
        console.error('Error guardando producto en localStorage:', err);
        alert('❌ Error al guardar producto');
    }
}


// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        sessionStorage.clear();
        console.log("✅ Sesión cerrada");
        window.location.href = "index.html";
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
    }
});

// Cargar películas y mostrarlas en la lista
async function loadMovies() {
    const movies = await getMovies();
    const moviesList = document.getElementById('moviesList');
    
    if (!moviesList) return;
    
    moviesList.innerHTML = '';
    
    if (movies.length === 0) {
        moviesList.innerHTML = '<p style="color: white; text-align: center;">No hay películas registradas</p>';
        return;
    }
    
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'item-card';

        // Determinar el estado de la película
        const today = new Date().toISOString().split('T')[0];
        let statusBadge = '';
        if (movie.endDate < today) {
            statusBadge = `<span class="estado-badge estado-finalizada">Finalizada</span>`;
        } else if (movie.startDate > today) {
            statusBadge = `<span class="estado-badge estado-proximo">Próximamente</span>`;
        } else {
            statusBadge = `<span class="estado-badge estado-cartelera">En Cartelera</span>`;
        }

        movieElement.innerHTML = `
            <h4>${movie.title} ${statusBadge}</h4>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Género:</strong> ${movie.genre}</p>
            <p><strong>Duración:</strong> ${movie.duration} minutos</p>
            <p><strong>Desde:</strong> ${movie.startDate} <strong>Hasta:</strong> ${movie.endDate}</p>
            <p>${movie.description.substring(0, 100)}...</p>
        `;
        moviesList.appendChild(movieElement);
    });
}