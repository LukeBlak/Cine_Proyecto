document.getElementById("movieForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("movieTitle").value;
  const descripcion = document.getElementById("movieDescription").value;
  const genero = document.getElementById("movieGenre").value;
  const duracion = document.getElementById("movieDuration").value;
  const fechaInicio = document.getElementById("movieStartDate").value;
  const fechaFinal = document.getElementById("movieEndDate").value;
  const imagen = document.getElementById("movieImage").value;



  // Leer datos previos
  const lista = JSON.parse(localStorage.getItem("pelicula")) || [];

  // Agregar nuevo registro
  lista.push({ titulo, descripcion, genero, duracion, fechaInicio, fechaFinal, imagen });

  // Guardar nuevamente
  localStorage.setItem("pelicula", JSON.stringify(lista));

  alert("Datos guardados");
  this.reset();
});