import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client with proper error handling
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      },
      global: {
        fetch: (...args) => fetch(...args).catch(() => ({
          ok: false,
          json: async () => ({ error: 'Network error' })
        } as Response))
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

export type FileCategory = 'resident_guidelines' | 'cpgs' | 'trauma_policies' | 'resources'

export interface FileRecord {
  id: string
  created_at: string
  title: string
  description?: string
  file_url: string
  category: FileCategory
}