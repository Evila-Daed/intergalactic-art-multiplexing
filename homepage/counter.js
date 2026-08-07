const SUPABASE_URL = "IL_TUO_PROJECT_URL";
const SUPABASE_KEY = "LA_TUA_PUBLISHABLE_KEY";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);