// JS/cartelera.js
import { getMovies } from './service/moviesService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const carteleraContainer = document.querySelector('.cartelera');

    // Opcional: Limpiar solo las tarjetas dinámicas (si quieres mantener las estáticas)
    // Pero si quieres reemplazar todo, descomenta esta línea:
    // carteleraContainer.innerHTML = '';

    try {
        const movies = await getMovies();
        
        if (!movies || movies.length === 0) {
            console.log("No se encontraron películas en Firestore");
            return;
        }

        movies.forEach(movie => {
            // Agrupar horarios por día
            const grouped = {};
            movie.schedules?.forEach(s => {
                if (!grouped[s.day]) grouped[s.day] = [];
                grouped[s.day].push(s.time);
            });

            // Generar filas de la tabla
            let rows = '';
            for (const [day, times] of Object.entries(grouped)) {
                rows += `<tr><td rowspan="${times.length}">${day}</td><td>${times[0]}</td></tr>`;
                for (let i = 1; i < times.length; i++) {
                    rows += `<tr><td>${times[i]}</td></tr>`;
                }
            }

            // Crear la tarjeta completa con todas las clases
            const movieCard = document.createElement('a');
            movieCard.href = '#'; // o usa una URL dinámica: `pelicula.html?id=${movie.id}`
            movieCard.className = 'tarjeta-enlace';

            movieCard.innerHTML = `
                <div class="tarjeta">
                    <img src="${movie.imageUrl || 'IMG/default.jpg'}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <details class="horarios">
                        <summary>Horarios</summary>
                        <table class="tabla-horarios">
                            <thead>
                                <tr>
                                    <th>Día</th>
                                    <th>Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </details>
                    <button class="boton">Tickets</button>
                    <div class="listadeseo">
                        <span>♡</span>
                        <p>Añadir a Lista de deseos</p>
                    </div>
                </div>
            `;

            carteleraContainer.appendChild(movieCard);
        });

    } catch (error) {
        console.error("Error al cargar películas:", error);
        alert("Error al cargar películas. Revisa la consola.");
    }
});