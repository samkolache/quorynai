import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Mode = "signin" | "signup";

function Login() {
    const [mode, setMode] = useState<Mode>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError} = 
            mode === "signin"
            ? await supabase.auth.signInWithPassword({email, password})
            : await supabase.auth.signUp({email, password});

            setLoading(false)

            if(authError) {
                setError(authError.message)
                return;
            }

            navigate("/", {replace: true})

    }

    const inputClass =
        "w-full rounded-lg border border-primary/30 bg-[#0f0a1f]/60 px-4 py-2.5 " +
        "text-foreground placeholder:text-foreground/40 outline-none " +
        "focus:border-primary focus:ring-1 focus:ring-primary/50";

    return (
        <section className="flex min-h-screen items-center justify-center px-6 py-12">
            <Card className="w-full max-w-md [--card-spacing:--spacing(7)] border border-primary/25 bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80">
                <CardContent className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="font-heading text-3xl font-light">
                            {mode === "signup" ? "Create your account" : "Welcome back"}
                        </h1>
                        <p className="text-sm text-foreground/60">
                            {mode === "signup"
                                ? "Begin your reading in 60 seconds."
                                : "Sign in to continue your journey."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className={inputClass}
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            minLength={6}
                            className={inputClass}
                        />

                        {error && (
                            <p className="text-sm text-red-400" role="alert">
                                {error}
                            </p>
                        )}

                        <Button type="submit" size="md" disabled={loading} className="w-full">
                            {loading
                                ? "Please wait..."
                                : mode === "signup"
                                  ? "Create account"
                                  : "Sign in"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-foreground/60">
                        {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === "signin" ? "signup" : "signin");
                                setError(null);
                            }}
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            {mode === "signup" ? "Sign in" : "Create an account"}
                        </button>
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}

export default Login;
