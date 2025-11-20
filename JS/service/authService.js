// JS/service/auth.js
import { auth, db } from '../firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { 
    doc, 
    getDoc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Registrar NUEVO EMPLEADO (solo para admin)
export async function registerUser(email, password, firstName, lastName, role = 'empleado') {
    try {
        console.log("Creando usuario en Auth...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Usuario creado en Auth, UID:", user.uid);
        
        console.log("Creando documento en Firestore en colección 'empleados'...");
        await setDoc(doc(db, "empleados", user.uid), {
            firstName,
            lastName,
            email,
            password, // ⚠️ Solo para pruebas - ¡ELIMINAR EN PRODUCCIÓN!
            role: role.toLowerCase().trim(), // siempre 'empleado'
            createdAt: new Date()
        });
        console.log("Documento creado en Firestore (colección 'empleados')");
        
        return { success: true };
    } catch(error) {
        console.error("Error completo en registerUser:", error);
        return { success: false, error: error.message };
    }
}

// Iniciar sesión: busca primero en 'admin', luego en 'empleados'
export async function loginUser(email, password) {
    try {
        console.log("Intentando autenticar usuario...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Usuario autenticado, UID:", user.uid);

        // Buscar en colección 'admin'
        let userData = null;
        let userRole = null;

        const adminDoc = await getDoc(doc(db, "admin", user.uid));
        if (adminDoc.exists()) {
            userData = adminDoc.data();
            userRole = 'admin';
            console.log('✅ Usuario encontrado en colección "admin"');
        } else {
            // Si no está en admin, buscar en 'empleados'
            const empleadoDoc = await getDoc(doc(db, "empleados", user.uid));
            if (empleadoDoc.exists()) {
                userData = empleadoDoc.data();
                userRole = 'empleado';
                console.log('✅ Usuario encontrado en colección "empleados"');
            } else {
                console.warn('❌ Usuario autenticado en Auth, pero NO existe en Firestore (ni en admin ni en empleados)');
                return null;
            }
        }

        return { 
            ...userData, 
            uid: user.uid,
            role: userRole // Aseguramos que el rol sea 'admin' o 'empleado'
        };

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        console.error('Código:', error.code);
        console.error('Mensaje:', error.message);
        return null;
    }
}

export { signOut };