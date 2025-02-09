import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Define the type for our database briefs table
export type Brief = {
  id: number;
  content: string;
  industry: string;
  difficulty: string;
  company_name?: string;
  created_at: string;
  brand_colors?: string[];
  style?: string;
  deliverables?: string[];
};

// Create a single supabase client for interacting with your database
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
); 