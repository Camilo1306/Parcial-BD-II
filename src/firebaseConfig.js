// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOO5Y8DtO_2DnNfxHO-HecOZmXDQyCQzo",
  authDomain: "tiendaropa-eba49.firebaseapp.com",
  projectId: "tiendaropa-eba49",
  storageBucket: "tiendaropa-eba49.firebasestorage.app",
  messagingSenderId: "958574646773",
  appId: "1:958574646773:web:77283a0a57c1a0d0cb3cbc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app

