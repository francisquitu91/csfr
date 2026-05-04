import { supabase } from './supabase'

export interface LibroEstanteria {
  id: string
  title: string
  drive_link: string
  cover_image_url?: string
  author?: string
  description?: string
  category?: string
  order_index?: number
  created_at?: string
  updated_at?: string
}

export async function fetchLibrosEstanteria(): Promise<LibroEstanteria[]> {
  try {
    const { data, error } = await supabase
      .from('estanteria_virtual')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as LibroEstanteria[]
  } catch (error) {
    console.error('fetchLibrosEstanteria error', error)
    return []
  }
}

export async function addLibroEstanteria(libro: Partial<LibroEstanteria>): Promise<LibroEstanteria | null> {
  try {
    const { data, error } = await supabase
      .from('estanteria_virtual')
      .insert([libro])
      .select()
      .single()

    if (error) throw error
    return data as LibroEstanteria
  } catch (error) {
    console.error('addLibroEstanteria error', error)
    return null
  }
}

export async function updateLibroEstanteria(
  id: string,
  updates: Partial<LibroEstanteria>
): Promise<LibroEstanteria | null> {
  try {
    const { data, error } = await supabase
      .from('estanteria_virtual')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as LibroEstanteria
  } catch (error) {
    console.error('updateLibroEstanteria error', error)
    return null
  }
}

export async function deleteLibroEstanteria(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('estanteria_virtual').delete().eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('deleteLibroEstanteria error', error)
    return false
  }
}

export function extractGoogleDriveFileId(url: string): string | null {
  // Extraer ID de Google Drive de diferentes formatos de URL
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    /[?&]id=([a-zA-Z0-9-_]+)/,
    /^([a-zA-Z0-9-_]+)$/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

export function getGoogleDrivePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`
}
