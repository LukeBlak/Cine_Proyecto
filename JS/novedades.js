// JS/novedades.js
import { getMovies } from './service/moviesService.js';

function isFutureDate(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar horas
    const movieDate = new Date(dateStr);
    return movieDate > today;
}

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.cartelera');
    if (!container) return;

    const allMovies = await getMovies();
    const futureMovies = allMovies.filter(movie => 
        movie.status === 'cartelera' && isFutureDate(movie.startDate)
    );

    if (futureMovies.length === 0) {
        container.innerHTML = '<p style="color: white; text-align: center; width: 100%;">No hay estrenos próximos</p>';
        return;
    }

    futureMovies.forEach(movie => {
        const card = document.createElement('a');
        card.href = '#'; // o usa una URL dinámica
        card.className = 'tarjeta-enlace';

        card.innerHTML = `
            <div class="tarjeta">
                <img src="${movie.imageUrl || 'IMG/default.jpg'}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p class="fecha-estreno">Estreno: ${new Date(movie.startDate).toLocaleDateString('es-ES')}</p>
                <button class="boton">Notificar Estreno</button>
                <div class="listadeseo">
                    <span>♡</span>
                    <p>Añadir a Lista de deseos</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
});