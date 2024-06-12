import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database"; // Thêm dòng này để import Firebase Realtime Database
import "firebase/compat/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCtVvwPEsf04f004YIr5M46UBG3t3RYkQ4",
    authDomain: "nftmarket-auth.firebaseapp.com",
    projectId: "nftmarket-auth",
    storageBucket: "nftmarket-auth.appspot.com",
    messagingSenderId: "790898191075",
    appId: "1:790898191075:web:c188fd6f0972e0323f73d6",
    measurementId: "G-ZVWEH8W8Y1" 
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();
export const db = firebase.firestore(); // Khởi tạo Firebase Realtime Database
export default firebase;