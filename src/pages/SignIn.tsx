import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthCard from "@/components/auth/AuthCard"
import GoogleSignIn from "@/components/auth/GoogleSignIn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveAccountEmail } from "@/lib/account"

function SignIn() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // TODO: check { email, password } against the backend once one exists.
        saveAccountEmail(email.trim())
        navigate("/dashboard")
    }

    return (
        <AuthCard
            eyebrow="Welcome back"
            title="Sign in"
            subtitle="Your chart and readings are right where you left them."
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" size="md" className="mt-2 w-full text-base">
                    Sign in
                </Button>
            </form>

            <GoogleSignIn />

            <p className="text-center text-sm">
                New to Quoryn?{" "}
                <Link to="/onboarding" className="text-accent hover:underline">
                    Create an account
                </Link>
            </p>
        </AuthCard>
    )
}

export default SignIn
