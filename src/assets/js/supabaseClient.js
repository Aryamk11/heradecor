// src/assets/js/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Read the secure variables from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// If the variables are not loaded, throw a clear error.
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not found. Ensure you have a .env file in the project root and have restarted the Vite server.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);