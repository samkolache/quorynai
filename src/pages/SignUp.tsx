import { useState, type FormEvent } from "react"
import { Link, Navigate } from "react-router-dom"
import AuthCard from "@/components/auth/AuthCard"
import GoogleSignIn from "@/components/auth/GoogleSignIn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveAccountEmail } from "@/lib/account"
import { loadOnboarding } from "@/lib/onboarding"

const MIN_PASSWORD_LENGTH = 8

function SignUp() {
    const [onboarding] = useState(loadOnboarding)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [created, setCreated] = useState(false)

    // New users must finish onboarding before creating an account.
    if (!onboarding) return <Navigate to="/onboarding" replace />

    const firstName = onboarding.fullName.split(" ")[0]

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match.")
            return
        }
        setError("")
        // TODO: send { email, password, ...onboarding } to the backend once one exists.
        saveAccountEmail(email.trim())
        setCreated(true)
    }

    if (created) {
        return (
            <AuthCard
                eyebrow="You're in"
                title={`Welcome, ${firstName}`}
                subtitle="Your account is ready. Your first reading is waiting for you."
            >
                <Button
                    render={<Link to="/dashboard" />}
                    nativeButton={false}
                    size="md"
                    className="w-full text-base"
                >
                    Go to your dashboard
                </Button>
            </AuthCard>
        )
    }

    return (
        <AuthCard
            eyebrow="Step 2 of 2"
            title="Create your account"
            subtitle={`Almost there, ${firstName}. Set up your login to save your chart.`}
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
                    <Label htmlFor="password">Create password</Label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword">Verify password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        required
                        aria-invalid={error ? true : undefined}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <p role="alert" className="text-sm text-destructive opacity-100">
                        {error}
                    </p>
                )}

                <Button type="submit" size="md" className="mt-2 w-full text-base">
                    Create account
                </Button>
            </form>

            <GoogleSignIn />

            <p className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="text-accent hover:underline">
                    Sign in
                </Link>
            </p>
        </AuthCard>
    )
}

export default SignUp
