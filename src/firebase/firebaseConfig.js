import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBi7sjpZHQTd-nkk92tmeteUq7dZ1ov6Nw",
  authDomain: "siginup-67ad2.firebaseapp.com",
  projectId: "siginup-67ad2",
  storageBucket: "siginup-67ad2.appspot.com",
  messagingSenderId: "163786713295",
  appId: "1:163786713295:web:6cbf2e69e48e9a8904efba",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
