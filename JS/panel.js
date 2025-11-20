// js/panel.js
import { auth } from './firebase-config.js';
import { registerUser, signOut } from './service/authService.js';
import { saveMovie, getMovies } from './service/moviesService.js';
import { savePromotion, saveProduct } from './service/productsService.js';

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
        
        // Mostrar tab de registro de empleados
        const employeeTab = document.querySelector('[data-tab="employees"]');
        if (employeeTab) {
            employeeTab.style.display = 'block';
            console.log("✅ Tab de empleados visible");
        }
    } else {
        console.log("ℹ️ Usuario es EMPLEADO");
        document.getElementById('userRole').textContent = 'Empleado';
        
        // Ocultar sección de admin
        const adminSection = document.getElementById('adminSection');
        if (adminSection) {
            adminSection.style.display = 'none';
        }
        
        // Ocultar tab de registro de empleados
        const employeeTab = document.querySelector('[data-tab="employees"]');
        if (employeeTab) {
            employeeTab.style.display = 'none';
        }
    }

    // Cargar películas
    loadMovies();
});

// Manejo de pestañas
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Registrar empleado (solo admin)
const registerForm = document.getElementById('registerEmployeeForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userRole = sessionStorage.getItem('userRole');
        console.log("Intentando registrar empleado. Rol actual:", userRole);
        
        if (userRole !== 'Admin' && userRole !== 'admin') {
            alert('❌ No tienes permisos para registrar empleados');
            return;
        }
        
        const email = document.getElementById('employeeEmail').value;
        const password = document.getElementById('employeePassword').value;
        const firstName = document.getElementById('employeeFirstName').value;
        const lastName = document.getElementById('employeeLastName').value;
        
        console.log("Registrando empleado:", email);
        
        const result = await registerUser(email, password, firstName, lastName, 'empleado');
        
        if (result.success) {
            alert('✅ Empleado registrado exitosamente');
            document.getElementById('registerEmployeeForm').reset();
        } else {
            alert('❌ Error al registrar empleado: ' + result.error);
        }
    });
}

// Guardar película
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

// Cargar películas
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
        movieElement.innerHTML = `
            <h4>${movie.title} <span class="estado-badge estado-cartelera">En Cartelera</span></h4>
            <p><strong>Género:</strong> ${movie.genre}</p>
            <p><strong>Duración:</strong> ${movie.duration} minutos</p>
            <p><strong>Desde:</strong> ${movie.startDate} <strong>Hasta:</strong> ${movie.endDate}</p>
            <p>${movie.description}</p>
        `;
        moviesList.appendChild(movieElement);
    });
}
