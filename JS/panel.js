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
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
    
    // Verificar si es admin y mostrar el rol correcto
    const userRoleElement = document.getElementById('userRole');
    if (userRole === 'Admin' || userRole === 'admin') {
        console.log("✅ Usuario es ADMIN");
        if (userRoleElement) {
            userRoleElement.textContent = 'Administrador General';
        }
        
        // Mostrar sección de admin
        const adminSection = document.getElementById('adminSection');
        if (adminSection) {
            adminSection.style.display = 'block';
            console.log("✅ Sección de admin visible");
        }
        
        // Cargar datos iniciales solo si es admin
        loadMovies();
        
    } else {
        if (userRoleElement) {
            userRoleElement.textContent = 'Empleado';
        }
        console.log("✅ Usuario es Empleado, acceso limitado/sólo visualización");
    }

    // Inicializar listeners de los formularios
    initializeForms();
    initializeTabs();
    initializeLogout();
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
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Cargar datos específicos al cambiar de pestaña si es necesario
            if (targetId === 'peliculas') {
                loadMovies();
            }
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
        console.log("✅ Formulario de películas inicializado");
    } else {
        console.warn("⚠️ Formulario 'movieForm' no encontrado");
    }
    
    // 2. Formulario de Promociones
    const promotionForm = document.getElementById('promotionForm');
    if (promotionForm) {
        promotionForm.addEventListener('submit', handleSavePromotion);
        console.log("✅ Formulario de promociones inicializado");
    } else {
        console.warn("⚠️ Formulario 'promotionForm' no encontrado");
    }
    
    // 3. Formulario de Productos de Dulcería
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleSaveProduct);
        console.log("✅ Formulario de productos inicializado");
    } else {
        console.warn("⚠️ Formulario 'productForm' no encontrado");
    }
}

// === HELPERS PARA OBTENER VALORES DE FORMA SEGURA ===

function getElementValue(id, defaultValue = '') {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`⚠️ Elemento '${id}' no encontrado`);
        return defaultValue;
    }
    return element.value || defaultValue;
}

function getElementValueAsNumber(id, defaultValue = 0) {
    const value = getElementValue(id, String(defaultValue));
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}

// === HANDLERS DE FORMULARIOS ===

const movieForm = document.getElementById('movieForm');
if (movieForm) {
    // Agregar horarios dinámicamente
    document.getElementById('addSchedule').addEventListener('click', () => {
        const container = document.getElementById('scheduleInputs');
        const div = document.createElement('div');
        div.className = 'schedule-item';
        div.innerHTML = `
            <input type="text" class="schedule-day" placeholder="Ej: Domingo 5" required>
            <input type="time" class="schedule-time" required>
        `;
        container.appendChild(div);
    });

    movieForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Recolectar horarios
        const scheduleItems = document.querySelectorAll('.schedule-item');
        const schedules = [];
        for (const item of scheduleItems) {
            const day = item.querySelector('.schedule-day').value;
            const time = item.querySelector('.schedule-time').value;
            if (day && time) {
                schedules.push({ day, time });
            }
        }

        const movieData = {
            title: document.getElementById('movieTitle').value,
            description: document.getElementById('movieDescription').value,
            genre: document.getElementById('movieGenre').value,
            duration: parseInt(document.getElementById('movieDuration').value),
            startDate: document.getElementById('movieStartDate').value,
            endDate: document.getElementById('movieEndDate').value,
            imageUrl: document.getElementById('movieImage').value,
            schedules: schedules, // ← Aquí van los horarios
            status: 'cartelera'
        };

        const success = await saveMovie(movieData);
        if (success) {
            alert('✅ Película guardada exitosamente');
            movieForm.reset();
            // Limpiar horarios
            document.getElementById('scheduleInputs').innerHTML = `
                <div class="schedule-item">
                    <input type="text" class="schedule-day" placeholder="Ej: Sábado 4" required>
                    <input type="time" class="schedule-time" required>
                </div>
            `;
            loadMovies(); // opcional: recargar lista en panel
        } else {
            alert('❌ Error al guardar película');
        }
    });
}

// Manejar el guardado de promociones
function handleSavePromotion(e) {
    e.preventDefault();

    const title = getElementValue('promotionTitle', 'Promoción');
    const description = getElementValue('promotionDescription');
    const discount = getElementValue('promotionDiscount');
    const endDate = getElementValue('promotionEndDate');

    const precioLabel = discount ? `${parseFloat(discount)}% OFF` : '';

    const productData = {
        nombre: title,
        precio: precioLabel || '—',
        imagen: 'default',
        descripcion: description,
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
        localStorage.setItem('dulceriaLastCategory', catKey);

        alert('✅ Promoción guardada como producto en la categoría "combos"');
        const form = document.getElementById('promotionForm');
        if (form) form.reset();
    } catch (err) {
        console.error('Error guardando promoción en localStorage:', err);
        alert('❌ Error al guardar promoción');
    }
}

// Normalizar categorías
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

// Manejar el guardado de productos de dulcería
async function handleSaveProduct(e) {
    e.preventDefault();

    const name = getElementValue('productName');
    const description = getElementValue('productDescription');
    const priceValue = getElementValue('productPrice');
    const stockValue = getElementValueAsNumber('productStock', 0);
    const rawCategory = getElementValue('productCategory', 'otros');

    const catKey = normalizeCategory(rawCategory);

    const price = isNaN(parseFloat(priceValue)) ? priceValue : `$${parseFloat(priceValue).toFixed(2)}`;

    const productData = {
        nombre: name || 'Sin nombre',
        precio: price,
        imagen: 'default',
        descripcion: description || '',
        stock: stockValue
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
        const form = document.getElementById('productForm');
        if (form) form.reset();
    } catch (err) {
        console.error('Error guardando producto en localStorage:', err);
        alert('❌ Error al guardar producto');
    }
}

// Inicializar botón de logout
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                sessionStorage.clear();
                console.log("✅ Sesión cerrada");
                window.location.href = "index.html";
            } catch (error) {
                console.error('❌ Error al cerrar sesión:', error);
                alert('Error al cerrar sesión: ' + error.message);
            }
        });
    } else {
        console.warn("⚠️ Botón 'logoutBtn' no encontrado");
    }
}

// Cargar películas y mostrarlas en la lista
async function loadMovies() {
    try {
        const movies = await getMovies();
        const moviesList = document.getElementById('moviesList');
        
        if (!moviesList) {
            console.warn("⚠️ Elemento 'moviesList' no encontrado");
            return;
        }
        
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
        
        console.log(`✅ ${movies.length} películas cargadas`);
    } catch (error) {
        console.error('❌ Error cargando películas:', error);
    }
}