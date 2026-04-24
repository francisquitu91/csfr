import { supabase } from './supabase'

function normalizeCourse(input: string): string {
  return (input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/°/g, 'º')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+[a-z]$/i, '')
    .replace(/^1\s*medio$/, 'i medio')
    .replace(/^2\s*medio$/, 'ii medio')
    .replace(/^3\s*medio$/, 'iii medio')
    .replace(/^4\s*medio$/, 'iv medio')
}

export interface PlanBook {
  id: string
  year?: string
  course: string
  category?: string
  unit?: string
  title: string
  author?: string
  editorial?: string
  is_choice?: boolean
  choice_group?: number | null
  order_index?: number
  notes?: string
  created_at?: string
  updated_at?: string
}

export async function fetchPlanBooks(filters: { year?: string; course?: string; q?: string } = {}): Promise<PlanBook[]> {
  try {
    let query = supabase.from('plan_lector_books').select('*')
    if (filters.year === '2025') {
      // 2025 must preserve the original legacy content, which may have no year assigned.
      query = query.or('year.is.null,year.eq.2025')
    } else if (filters.year) {
      query = query.eq('year', filters.year)
    }
    if (filters.q) {
      const q = filters.q.trim()
      query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%,editorial.ilike.%${q}%`)
    }
    const { data, error } = await query.order('course').order('order_index')
    if (error) throw error
    const rows = (data || []) as PlanBook[]

    // Deduplicate by course+title+author+editorial to avoid showing repeated entries
    const seen = new Set<string>()
    const deduped: PlanBook[] = []
    for (const r of rows) {
      const key = `${r.year || ''}||${r.course}||${r.title}||${r.author||''}||${r.editorial||''}`.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        deduped.push(r)
      }
    }

    if (!filters.course) {
      return deduped
    }

    const selectedCourse = normalizeCourse(filters.course)
    return deduped.filter((r) => {
      const rowCourse = normalizeCourse(r.course || '')
      return rowCourse === selectedCourse
    })
  } catch (error) {
    console.error('fetchPlanBooks error', error)
    return []
  }
}

export async function addPlanBook(book: Partial<PlanBook>) {
  try {
    const { data, error } = await supabase.from('plan_lector_books').insert([book]).select().single()
    if (error) throw error
    return data as PlanBook
  } catch (error) {
    console.error('addPlanBook error', error)
    return null
  }
}

export async function updatePlanBook(id: string, updates: Partial<PlanBook>) {
  try {
    const { data, error } = await supabase.from('plan_lector_books').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data as PlanBook
  } catch (error) {
    console.error('updatePlanBook error', error)
    return null
  }
}

export async function deletePlanBook(id: string) {
  try {
    const { error } = await supabase.from('plan_lector_books').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (error) {
    console.error('deletePlanBook error', error)
    return false
  }
}
