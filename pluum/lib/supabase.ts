import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wnptybnjuixwjfuugzac.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducHR5Ym5qdWl4d2pmdXVnemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc0NDQxMDQsImV4cCI6MjAxMzAyMDEwNH0.7tYkK4djkoGbrQGXoqnk3pvNIXRvSvrx8qgUnO8F7Z0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})