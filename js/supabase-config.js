// js/supabase-config.js
// TODO: PASTE YOUR SUPABASE URL AND ANON KEY HERE

const SUPABASE_URL = 'https://eqktbcdigrfgaqnindmm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3RiY2RpZ3JmZ2FxbmluZG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDEzMjQsImV4cCI6MjA3MDg3NzMyNH0.khk0abbnloMHidmNXvCFNRXdOpOXvs7UMQJn3EssKOI';

// Initialize the Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
