import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase Configuration:');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Key exists:', !!supabaseKey);
console.log('🌐 Current domain:', window.location.origin);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true // This is important for OAuth
  }
})