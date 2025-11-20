document.addEventListener("DOMContentLoaded", () => {
  const tablaBody = document.querySelector("#section-peliculas");

  const lista = JSON.parse(localStorage.getItem("pelicula")) || [];

  lista.forEach(pelicula => {
    const fila = document.createElement("div");

    fila.innerHTML = `
      <div class="tarjeta">
          <img src="IMG/dia1blovistemoda.jpg" alt="">
          <h3>${pelicula.titulo}</h3>
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
                <tr>
                  <td rowspan="2">${pelicula.fechaInicio}</td>
                  <td>6:30 pm</td>
                </tr>
                <tr>
                  <td>9:15 pm</td>
                </tr>
                <tr>
                  <td rowspan="3">${pelicula.fechaFinal}</td>
                  <td>12:00 pm</td>
                </tr>
                <tr>
                  <td>3:00 pm</td>
                </tr>
                <tr>
                  <td>8:00 pm</td>
                </tr>
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

    tablaBody.appendChild(fila);
  });
});
