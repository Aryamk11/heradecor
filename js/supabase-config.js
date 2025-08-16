// js/supabase-config.js
// CORRECTED: Initialize the client with a unique variable name (_supabase)
// to avoid conflict with the global 'supabase' object from the CDN script.
const { createClient } = supabase;
const supabaseClient = createClient(
    'https://eqktbcdigrfgaqnindmm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3RiY2RpZ3JmZ2FxbmluZG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDEzMjQsImV4cCI6MjA3MDg3NzMyNH0.khk0abbnloMHidmNXvCFNRXdOpOXvs7UMQJn3EssKOI'
);

// Now, re-assign the global supabase variable to our initialized client.
supabase = supabaseClient;