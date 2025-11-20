import { auth, registerUser, saveMovie, getMovies, savePromotion, saveProduct, signOut } from './service/firebase.js';

// Verificar autenticación
document.addEventListener('DOMContentLoaded', function() {
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    const userUID = sessionStorage.getItem('userUID');

    if (!userRole || !userName) {
        window.location.href = "login.html";
        return;
    }

    // Mostrar información del usuario
    document.getElementById('userName').textContent = userName;
    document.getElementById('userRole').textContent = userRole === 'admin' ? 'Administrador General' : 'Empleado';
    
    // Mostrar sección de admin solo si es admin
    if (role === 'admin') {
        document.getElementById('adminSection').style.display = 'block';
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
document.getElementById('registerEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'admin') {
        alert('No tienes permisos para registrar empleados');
        return;
    }
    
    const email = document.getElementById('employeeEmail').value;
    const password = document.getElementById('employeePassword').value;
    const firstName = document.getElementById('employeeFirstName').value;
    const lastName = document.getElementById('employeeLastName').value;
    
    const status = await registerUser(email, password, firstName, lastName, 'empleado');
    
    if (status) {
        alert('Empleado registrado exitosamente');
        document.getElementById('registerEmployeeForm').reset();
    } else {
        alert('Error al registrar empleado');
    }
});

// Guardar película
document.getElementById('movieForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const movieData = {
        title: document.getElementById('movieTitle').value,
        description: document.getElementById('movieDescription').value,
        genre: document.getElementById('movieGenre').value,
        duration: parseInt(document.getElementById('movieDuration').value),
        startDate: document.getElementById('movieStartDate').value,
        endDate: document.getElementById('movieEndDate').value,
        imageUrl: document.getElementById('movieImage').value || '',
        status: 'cartelera'
    };
    
    const status = await saveMovie(movieData);
    
    if (status) {
        alert('Película guardada exitosamente');
        document.getElementById('movieForm').reset();
        loadMovies();
    } else {
        alert('Error al guardar película');
    }
});


document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        sessionStorage.clear();
        window.location.href = "login.html";
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});

async function loadMovies() {
    const movies = await getMovies();
    const moviesList = document.getElementById('moviesList');
    
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
