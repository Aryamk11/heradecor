// js/firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyC8iE5lRcfQDFAkBbIV9XVzRdDYOMeaQT4",
  authDomain: "heradecor-5b215.firebaseapp.com",
  projectId: "heradecor-5b215",
  storageBucket: "heradecor-5b215.firebasestorage.app",
  messagingSenderId: "628717891164",
  appId: "1:628717891164:web:d8775da48346ed0a9ec099",
  measurementId: "G-9WBF3WQ6VJ"
};

// and create a reference to the Firestore database.
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
