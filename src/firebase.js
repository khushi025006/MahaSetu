import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbabbgcPS0JqN3d89IwT-3lGba0qWio_w",
  authDomain: "mahasetu-7befc.firebaseapp.com",
  projectId: "mahasetu-7befc",
  storageBucket: "mahasetu-7befc.firebasestorage.app",
  messagingSenderId: "598246422621",
  appId: "1:598246422621:web:75cc9b3ff06cc26d3f35b4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);