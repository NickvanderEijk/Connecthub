import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAU1iBckYRAH51xCWnPX_6G6yC8wAMaCU",
  authDomain: "connecthub-5a2c7.firebaseapp.com",
  projectId: "connecthub-5a2c7",
  storageBucket: "connecthub-5a2c7.firebasestorage.app",
  messagingSenderId: "481666864066",
  appId: "1:481666864066:web:c72f019e64ddeab677fc5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
