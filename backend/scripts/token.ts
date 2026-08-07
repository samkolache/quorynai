import { supabaseAdmin } from "../src/lib/supabase.js";

const email = process.argv[2] ?? "test@quoryn.dev";
const password = process.argv[3] ?? "test-password-123";

const { error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
});

if (createError && !/already/i.test(createError.message)) {
    console.error("Could not create user:", createError.message);
    process.exit(1);
}

const { data, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
});

if (signInError || !data.session) {
    console.error("Could not sign in:", signInError?.message);
    process.exit(1);
}

console.log(data.session.access_token);
