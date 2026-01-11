import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hukdsojhfrlmhpuedvsd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1a2Rzb2poZnJsbWhwdWVkdnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMzE5NjEsImV4cCI6MjA4MzYwNzk2MX0.HCy4-FM_68Pku2DN-J6TVGNzXIjdzP_UxD66bh2Xe8E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
