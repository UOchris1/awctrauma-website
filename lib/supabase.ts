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

export type FileCategory = 'cpgs' | 'resident_guidelines' | 'trauma_policies' | 'medical_student' | 'resources'

export type FileType = 'pdf' | 'docx' | 'doc'

export interface FileRecord {
  id: string
  created_at: string
  title: string
  description?: string
  file_url: string
  category: FileCategory
  file_type?: FileType
  file_size?: number
  updated_at?: string
  original_filename?: string
}

export type IconType = 'ribs' | 'pelvis' | 'vascular' | 'spleen' | 'liver' | 'kidney' | 'airway' | 'brain' | 'endocrine' | 'heme' | 'ortho' | 'default'

export interface AlgorithmRecord {
  id: string
  title: string
  short_title: string
  icon_type: IconType
  image_url?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}