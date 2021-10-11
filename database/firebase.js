import firebase from "firebase";
import "firebase/firestore";

// Your web app's Firebase configuration
/*
const firebaseConfig = {
    apiKey: "AIzaSyCZjmOJyA-OAAtzO1q1nJmwwgCFowUwRP8",
    authDomain: "proyecto-f6d11.firebaseapp.com",
    projectId: "proyecto-f6d11",
    storageBucket: "proyecto-f6d11.appspot.com",
    messagingSenderId: "164363464516",
    appId: "1:164363464516:web:57cb7d51dedc3a02757111"
  };
*/
  const firebaseConfig = {
    apiKey: "AIzaSyCZjmOJyA-OAAtzO1q1nJmwwgCFowUwRP8",
    authDomain: "proyecto-f6d11.firebaseapp.com",
    projectId: "proyecto-f6d11",
    storageBucket: "proyecto-f6d11.appspot.com",
    messagingSenderId: "164363464516",
    appId: "1:164363464516:web:57cb7d51dedc3a02757111"
  };
 if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ experimentalForceLongPolling: true });
 }else {
    firebase.app(); // if already initialized, use that one
 }

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);
//firebase.firestore.setLogLevel(null);


const db = firebase.firestore();

export default {
  firebase,
  db
};