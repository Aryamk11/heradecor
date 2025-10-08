// src/assets/js/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqktbcdigrfgaqnindmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3RiY2RpZ3JmZ2FxbmluZG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDEzMjQsImV4cCI6MjA3MDg3NzMyNH0.khk0abbnloMHidmNXvCFNRXdOpOXvs7UMQJn3EssKOI';

export const supabase = createClient(supabaseUrl, supabaseKey);