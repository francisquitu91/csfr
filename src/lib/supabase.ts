import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
  video_url?: string;
  show_date: boolean;
  created_at: string;
  updated_at: string;
}

export interface EditorialItem {
  id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DirectoryMember {
  id: string;
  name: string;
  position: string;
  photo_url?: string;
  category: 'directorio' | 'rectoria';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentHead {
  id: string;
  department: string;
  name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface OrientationTeamMember {
  id: string;
  name: string;
  position: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CycleCoordinator {
  id: string;
  cycle_name: string;
  grade_range: string;
  coordinator_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PastoralTeamMember {
  id: string;
  name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}