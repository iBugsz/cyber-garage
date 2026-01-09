import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ⚙️ Configuración Supabase
export const supabaseUrl = 'https://icnbvztrrkhmjugwavfn.supabase.co';
export const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbmJ2enRycmtobWp1Z3dhdmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODU1MDksImV4cCI6MjA4MzQ2MTUwOX0.d4207UJRb3gyGQ4mLKrAYVZ0Aa0G2xThOZJ2-qFbfTs';

// 🔹 Cliente Supabase único
export const supabase = createClient(supabaseUrl, supabaseKey);
