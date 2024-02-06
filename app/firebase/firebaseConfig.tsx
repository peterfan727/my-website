// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app"
import { Analytics, getAnalytics } from "firebase/analytics"
import { Firestore, getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics;
let db: Firestore;
if (firebaseConfig?.projectId) {
    app = initializeApp(firebaseConfig);
    // initialize analytics
    if (app.name && typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
    // initialize Firestore
    db = getFirestore(app)
}

export {app, analytics, db}