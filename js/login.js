import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from './firebase.js';

const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// 🔑 Función de login (la misma para botón y Enter)
function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showError('Completa todos los campos');
    return;
  }

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
}

// 👉 Click en botón
loginBtn.addEventListener('click', login);

// 👉 Enter en cualquier input del formulario
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    loginBtn.click(); // simula el click en el botón
  }
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
emailInput.addEventListener('input', hideError);
passwordInput.addEventListener('input', hideError);
