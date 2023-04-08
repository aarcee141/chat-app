// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCID011nJBjLjhwyjh3bvF-FjnFkK59pQw",
    authDomain: "start-chatting-fd745.firebaseapp.com",
    projectId: "start-chatting-fd745",
    storageBucket: "start-chatting-fd745.appspot.com",
    messagingSenderId: "855278592853",
    appId: "1:855278592853:web:42cdb87e8d58b95bce05dc",
    measurementId: "G-13JE6CXLQH",
};

if (!firebase.apps.length) {
    const app = firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);