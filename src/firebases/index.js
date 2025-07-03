import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACcBFr0q67Vo_-2eB-Y4ELChfa2fX2Amo",
  authDomain: "cukecute-ba311.firebaseapp.com",
  projectId: "cukecute-ba311",
  storageBucket: "cukecute-ba311.firebasestorage.app",
  messagingSenderId: "540446810049",
  appId: "1:540446810049:web:b65b2b1f141ba4d4bed940",
  measurementId: "G-E38FLXG8BK"
};
const app = initializeApp(firebaseConfig);

const db= getFirestore(app)

export {db}
