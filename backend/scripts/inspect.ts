import { supabaseAdmin } from "../src/lib/supabase.js";

const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

if (usersError) {
    console.error("Could not list users:", usersError.message);
    process.exit(1);
}

console.log("=== auth.users (Supabase-managed) ===");
for (const user of users.users) {
    const confirmed = user.email_confirmed_at ? "confirmed" : "UNCONFIRMED";
    console.log(`  ${user.email}  ${confirmed}  id=${user.id}`);
}

const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id, display_name, tier, birth_date");

if (profilesError) {
    console.error("Could not list profiles:", profilesError.message);
    process.exit(1);
}

console.log("=== public.profiles (yours) ===");
console.table(profiles);
