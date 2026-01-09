import { supabase } from './supabase.js';

const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// 🔑 Función de login
async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showError('Completa todos los campos');
    return;
  }

  hideError();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let message = 'Error al iniciar sesión';

    switch (error.message) {
      case 'Invalid login credentials':
        message = 'Correo o contraseña incorrectos';
        break;
      case 'Email not found':
        message = 'Usuario no existe';
        break;
      case 'Password is required':
        message = 'Escribe tu contraseña';
        break;
    }

    showError(message);
    console.error(error);
    return;
  }

  // ✅ Login exitoso
  window.location.href = './views/home/';
}

// 👉 Click en botón
loginBtn.addEventListener('click', login);

// 👉 Enter en cualquier input del formulario
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    loginBtn.click();
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
