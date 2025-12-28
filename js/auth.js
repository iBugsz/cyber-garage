import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { auth } from './firebase.js';

// 🔒 Proteger página
export function protectPage(redirect = 'index.html') {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = redirect;
    }
  });
}

// 🚪 Logout
export function setupLogout(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener('click', () => {
    signOut(auth).then(() => {
      window.location.href = 'index.html';
    });
  });
}
