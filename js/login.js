import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from './firebase.js';

document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = 'app.html';
    })
    .catch((error) => {
      alert('Error: ' + error.code);
      console.error(error);
    });
});
