import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgWRXKEPAPpbdkg0wvrIpPvhlrrNncv0I",
  authDomain: "planed-7c157.firebaseapp.com",
  projectId: "planed-7c157",
  storageBucket: "planed-7c157.firebasestorage.app",
  messagingSenderId: "82287145894",
  appId: "1:82287145894:web:0deaa0900a009c35481567",
  measurementId: "G-LYHFWZTNYB",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
