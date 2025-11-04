import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://abwwaojdxdlcgbskinzo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFid3dhb2pkeGRsY2dic2tpbnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDMyMzUsImV4cCI6MjA3NTYxOTIzNX0.-d1H9shNP3Wa0vHga1C1lt6QjGWjQLsGbjdUYu3AcgE'

export const supabase = createClient({
  url: supabaseUrl,
  anonKey: supabaseAnonKey
})

