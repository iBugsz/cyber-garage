// js/auth-guard.js
import { supabase } from './supabase.js';
import { setupLogout } from './auth.js';

export async function guardPage(loginRedirect = '../index.html') {
  const loader = document.getElementById('loader');
  const app = document.getElementById('app');

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // No hay sesión → redirige al login
    window.location.href = loginRedirect;
  } else {
    // Sí hay sesión → ocultar loader y mostrar contenido
    if (loader) loader.style.display = 'none';
    if (app) app.style.display = 'block';
    setupLogout('logoutBtn');
  }
}
