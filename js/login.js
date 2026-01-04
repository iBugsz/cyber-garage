import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from './firebase.js';

const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');

loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Validación rápida (antes de Firebase)
  if (!email || !password) {
    showError('Completa todos los campos');
    return;
  }

  // Limpia error previo
  hideError();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = 'home.html';
    })
    .catch((error) => {
      let message = 'Error al iniciar sesión';

      switch (error.code) {
        case 'auth/missing-password':
          message = 'Escribe tu contraseña';
          break;
        case 'auth/invalid-email':
          message = 'Correo inválido';
          break;
        case 'auth/user-not-found':
          message = 'Usuario no existe';
          break;
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-credential':
          message = 'Correo o contraseña incorrectos';
          break;
      }

      showError(message);
      console.error(error);
    });
});

// Helpers UI
function showError(text) {
  errorMsg.textContent = text;
  errorMsg.classList.remove('hidden');
}

function hideError() {
  errorMsg.classList.add('hidden');
}

// Ocultar error al escribir
document.getElementById('email').addEventListener('input', hideError);
document.getElementById('password').addEventListener('input', hideError);
