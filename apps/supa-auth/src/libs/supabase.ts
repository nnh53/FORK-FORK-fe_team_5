import { createClient, SupabaseClient } from "@supabase/supabase-js";


const supaUrl : string = "https://eqyalfbrzrcsrracrufh.supabase.co";
const apiKey : string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeWFsZmJyenJjc3JyYWNydWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMDQ4OTksImV4cCI6MjA2NDY4MDg5OX0.e2GPl-O0p8n5j1UlaLQqZQBAW6T8VtQdAzJwoaAKzgM";

export const supaClient : SupabaseClient = createClient(supaUrl, apiKey);