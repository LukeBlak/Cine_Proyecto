// JS/service/moviesService.js
import { db } from '../firebase-config.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

export async function saveMovie(movieData) {
    try {
        await addDoc(collection(db, "movies"), {
            ...movieData,
            createdAt: new Date()
        });
        return true;
    } catch (error) {
        console.error('Error guardando película:', error);
        return false;
    }
}

export async function getMovies() {
    try {
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movies = [];
        querySnapshot.forEach((doc) => {
            movies.push({ id: doc.id, ...doc.data() });
        });
        return movies;
    } catch (error) {
        console.error('Error obteniendo películas:', error);
        return [];
    }
}