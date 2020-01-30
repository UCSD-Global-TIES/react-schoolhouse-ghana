import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "AUTH_DOMAIN",
    databaseURL: "DB_URL",
    projectId: "PROJ_ID",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MSG_SENDER_ID",
    appId: "APP_ID",
    measurementId: "MEASURE_ID"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {
    firebase,
    storage as
    default
};