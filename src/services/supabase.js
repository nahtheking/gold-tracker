import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ulefqewsjvararvsbrow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWZxZXdzanZhcmFydnNicm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MDc2OTEsImV4cCI6MjA4NzM4MzY5MX0.docgTfCLkrRoZk551x-suON_Pkv9-j-IF9n-aqf-BaY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
