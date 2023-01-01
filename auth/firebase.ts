// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDeW33QFxVtCEu6MRTaqbyiZmw2IweIqqU",
  authDomain: "blastro-78456.firebaseapp.com",
  projectId: "blastro-78456",
  storageBucket: "blastro-78456.appspot.com",
  messagingSenderId: "385245357324",
  appId: "1:385245357324:web:9af0bd0a7aedc0d6c29529",
  measurementId: "G-8VDXC9LJF8"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebase)

export default firebaseAuth
