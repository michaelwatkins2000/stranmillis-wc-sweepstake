import { createClient } from '@supabase/supabase-js'

// Strip any trailing /rest/v1/ path — the JS client needs the bare project URL
const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Guard against missing env vars (e.g. during CI build without secrets set)
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null
