import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZwVGUEWKryZZ-oAzZtOcQ3nRm_TZNOKA",
  authDomain: "aiapp-8e8bd.firebaseapp.com",
  projectId: "aiapp-8e8bd",
  storageBucket: "aiapp-8e8bd.firebasestorage.app",
  messagingSenderId: "241974986270",
  appId: "1:241974986270:web:e6d29383bc5b075c27500f",
  measurementId: "G-RX24ECWXMY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
