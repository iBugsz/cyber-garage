import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from './firebase.js';

const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// ⚡ Mantener sesión iniciada incluso al cerrar la página
setPersistence(auth, browserLocalPersistence)
  .catch(error => console.error('Error persistencia:', error));

// Redirigir automáticamente si ya hay sesión activa
onAuthStateChanged(auth, user => {
  if (user) {
    // Usuario ya logueado
    window.location.href = 'app.html';
  }
});

// Login
loginBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validación rápida
  if (!email || !password) {
    showError('Completa todos los campos');
    return;
  }

  hideError();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Sesión iniciada correctamente
      window.location.href = 'app.html';
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
emailInput.addEventListener('input', hideError);
passwordInput.addEventListener('input', hideError);
