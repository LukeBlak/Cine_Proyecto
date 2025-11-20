// service/productsService.js
import { db } from '../firebase-config.js';
import { 
    collection, 
    addDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

export async function savePromotion(promotionData) {
    try {
        await addDoc(collection(db, "promotions"), {
            ...promotionData,
            createdAt: new Date()
        });
        return true;
    } catch (error) {
        console.error('Error guardando promoción:', error);
        return false;
    }
}

export async function saveProduct(productData) {
    try {
        await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: new Date()
        });
        return true;
    } catch (error) {
        console.error('Error guardando producto:', error);
        return false;
    }
}