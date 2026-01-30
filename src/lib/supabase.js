import { createClient } from '@supabase/supabase-js'

let supabase

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nazsvhwjaeeaugnqavwe.supabase.co'
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pYnTOcoC0-CtX_5AyMJaIA_8snZ8HJH'
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Some features may not work.')
  }
  
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} catch (error) {
  console.error('Failed to initialize Supabase client:', error)
  // Create a mock client to prevent crashes
  supabase = {
    from: () => ({
      select: () => ({ data: null, error: { message: 'Supabase not initialized' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not initialized' } }),
      update: () => ({ data: null, error: { message: 'Supabase not initialized' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not initialized' } }),
    })
  }
}

export { supabase }
