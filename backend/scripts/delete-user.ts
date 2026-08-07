import { supabaseAdmin } from "../src/lib/supabase.js";

const email = process.argv[2];

if (!email) {
    console.error("Usage: npm run delete-user <email>");
    process.exit(1);
}

const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

if (listError) {
    console.error("Could not list users:", listError.message);
    process.exit(1);
}

const user = users.users.find((candidate) => candidate.email === email);

if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
}

const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

if (deleteError) {
    console.error("Could not delete user:", deleteError.message);
    process.exit(1);
}

console.log(`Deleted ${email} (${user.id}) and its profile row via cascade.`);
