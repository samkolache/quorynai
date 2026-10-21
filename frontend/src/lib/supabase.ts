//creates suapbase client so rest of app can use it
import { createClient } from "@supabase/supabase-js";

//env variables for supabase configured with VITE
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

//fail test, prevents ap from building with undefiend
if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in frontend/.env"
    );
}

//returns the object that has everything
export const supabase = createClient(supabaseUrl, supabaseKey);
