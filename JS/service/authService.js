// js/service/auth.js
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

export async function registerUser(email, password, firstName, lastName, role = 'empleado') {
    try {
        console.log("Creando usuario en Auth...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Usuario creado en Auth, UID:", user.uid);
        
        console.log("Creando documento en Firestore...");
        await setDoc(doc(db, "empleados", user.uid), {
            firstName,
            lastName,
            password,
            email,
            role: role,
            createdAt: new Date()
        });
        console.log("Documento creado en Firestore");
        
        return true;
    } catch(error) {
        console.error("Error completo en registerUser:", error);
        console.error("Código de error:", error.code);
        console.error("Mensaje de error:", error.message);
        return false;
    }
}

export async function loginUser(email, password) {
    try {
        console.log("Intentando autenticar usuario...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Usuario autenticado, UID:", user.uid);

        console.log("Buscando datos en Firestore...");
        const dataUser = await getDoc(doc(db, "admin", user.uid));

        if (dataUser.exists()) {
            console.log('Usuario encontrado en Firestore');
            return { ...dataUser.data(), uid: user.uid };
        } else {
            throw new Error('No se encontró el usuario en la base de datos');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        console.error('Código:', error.code);
        console.error('Mensaje:', error.message);
        return null;
    }
}

export { signOut };