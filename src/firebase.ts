import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDCbUU4Rr1ZHCxv3dRy-cuPsEm6bokXNtQ",
    authDomain: "saas-translator-app-d1c10.firebaseapp.com",
    projectId: "saas-translator-app-d1c10",
    storageBucket: "saas-translator-app-d1c10.appspot.com",
    messagingSenderId: "132839979254",
    appId: "1:132839979254:web:63b8605e267bcaa574d4d7"
  };
  
  // Initialize Firebase
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app);

  export {db, auth, functions};