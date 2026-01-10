// js/login.js
import { loginUser } from "./service/authService.js";


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