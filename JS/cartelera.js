// JS/cartelera.js
import { getMovies } from './service/moviesService.js';

function isInRange(startDate, endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= today && today <= end;
}

document.addEventListener('DOMContentLoaded', async () => {
    const carteleraContainer = document.querySelector('.cartelera');
    if (!carteleraContainer) return;

    const allMovies = await getMovies();
    const currentMovies = allMovies.filter(movie => 
        movie.status === 'cartelera' && isInRange(movie.startDate, movie.endDate)
    );

    if (currentMovies.length === 0) {
        carteleraContainer.innerHTML = '<p style="color: white; text-align: center; width: 100%;">No hay películas en cartelera</p>';
        return;
    }

    currentMovies.forEach(movie => {
        // Agrupar horarios por día
        const grouped = {};
        movie.schedules?.forEach(s => {
            if (!grouped[s.day]) grouped[s.day] = [];
            grouped[s.day].push(s.time);
        });

        let rows = '';
        for (const [day, times] of Object.entries(grouped)) {
            rows += `<tr><td rowspan="${times.length}">${day}</td><td>${times[0]}</td></tr>`;
            for (let i = 1; i < times.length; i++) {
                rows += `<tr><td>${times[i]}</td></tr>`;
            }
        }

        const movieCard = document.createElement('a');
        movieCard.href = '#';
        movieCard.className = 'tarjeta-enlace';

        movieCard.innerHTML = `
            <div class="tarjeta">
                <img src="${movie.imageUrl || 'IMG/default.jpg'}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <details class="horarios">
                    <summary>Horarios</summary>
                    <table class="tabla-horarios">
                        <thead><tr><th>Día</th><th>Hora</th></tr></thead>
                        <tbody>${rows}</tbody>
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
});