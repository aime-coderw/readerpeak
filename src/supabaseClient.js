import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://egjszubktfzrxwxfhmdg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnanN6dWJrdGZ6cnh3eGZobWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MTU1MzIsImV4cCI6MjA4MDA5MTUzMn0.it1HZDacqsz9tfZZd68mqojnBT0pVj3PkOVNARjUIQE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
