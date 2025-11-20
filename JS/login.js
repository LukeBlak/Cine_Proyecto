// js/login.js
import { registerUser, loginUser } from "./service/authService.js";

// Registrar usuario
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    let correo = document.getElementById("registerEmail").value;
    let contraseña = document.getElementById("registerPassword").value;
    let nombre = document.getElementById("firstName").value;
    let apellido = document.getElementById("lastName").value;

    console.log("Intentando registrar:", correo);

    const status = await registerUser(correo, contraseña, nombre, apellido);

    if (status) {
        alert("Registro exitoso");
        document.getElementById("registerForm").reset();
    } else {
        alert("Error en el registro. Revisa la consola.");
    }
});

// Login de usuario
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    console.log("Intentando login:", email);

    try {
        const userData = await loginUser(email, password);

        if (userData) {
            sessionStorage.setItem('userRole', userData.role);
            sessionStorage.setItem('userName', `${userData.firstName} ${userData.lastName}`);
            sessionStorage.setItem('userUID', userData.uid);
            
            alert("Login exitoso!");
            window.location.href = "panel.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    } catch (error) {
        alert("Error durante el inicio de sesión.");
        console.error("Error:", error);
    }
});