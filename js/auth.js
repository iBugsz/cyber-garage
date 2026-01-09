import { supabase } from './supabase.js';

// 🔒 Proteger página
export async function protectPage(redirect = 'index.html') {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = redirect;
  }
}

// 🚪 Logout
export function setupLogout(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });
}
