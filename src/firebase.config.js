import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_XRo-aZePda18VN36ZWMmQhF4ETXm-Rs",
  authDomain: "ecommerce-7fc5a.firebaseapp.com",
  projectId: "ecommerce-7fc5a",
  storageBucket: "ecommerce-7fc5a.appspot.com",
  messagingSenderId: "990366245972",
  appId: "1:990366245972:web:260838492457931c9679c1"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;