import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

export const firebaseConfig = {
  apiKey: 'AIzaSyBjRjogcGU2_DrfOl18D-4JCoyWh2FBQxA',
  authDomain: 'cybergarage-f2ea8.firebaseapp.com',
  projectId: 'cybergarage-f2ea8',
  storageBucket: 'cybergarage-f2ea8.appspot.com',
  messagingSenderId: '799124426724',
  appId: '1:799124426724:web:dbe60029dda2b2c3afc1f1',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
