import { useState, type FormEvent } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UserPlus } from "lucide-react"
import AuthCard from "@/components/auth/AuthCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loadInvitedBy, saveInvitedBy } from "@/lib/friends"
import { GENDER_OPTIONS, loadOnboarding, saveOnboarding, type OnboardingInfo } from "@/lib/onboarding"

const emptyInfo: OnboardingInfo = {
    fullName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    gender: "",
}

function Onboarding() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    // Someone's invite link (/onboarding?invite=handle) brought this person here.
    const [invitedBy] = useState(() => {
        const handle = params.get("invite")
        if (handle) saveInvitedBy(handle)
        return handle ?? loadInvitedBy()
    })
    const [info, setInfo] = useState<OnboardingInfo>(() => loadOnboarding() ?? emptyInfo)

    const update = (field: keyof OnboardingInfo) => (value: string) =>
        setInfo((prev) => ({ ...prev, [field]: value }))

    const today = new Date().toISOString().split("T")[0]

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        saveOnboarding({ ...info, fullName: info.fullName.trim(), placeOfBirth: info.placeOfBirth.trim() })
        navigate("/reading")
    }

    return (
        <AuthCard
            eyebrow="Step 1 of 2"
            title="Tell us about you"
            subtitle="Your birth details let us map your sky and personalize every reading."
        >
            {invitedBy && (
                <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground/85">
                    <UserPlus className="size-4 shrink-0 text-accent" />
                    {/* TODO: connect the two accounts on the backend when sign-up completes. */}
                    <span>
                        <strong className="font-semibold">@{invitedBy}</strong> invited you. Once you join, you'll be connected and can compare your charts.
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                        id="fullName"
                        autoComplete="name"
                        placeholder="Your full name"
                        required
                        value={info.fullName}
                        onChange={(e) => update("fullName")(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="dateOfBirth">Date of birth</Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            autoComplete="bday"
                            max={today}
                            required
                            value={info.dateOfBirth}
                            onChange={(e) => update("dateOfBirth")(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="timeOfBirth">Time of birth</Label>
                        <Input
                            id="timeOfBirth"
                            type="time"
                            required
                            value={info.timeOfBirth}
                            onChange={(e) => update("timeOfBirth")(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="placeOfBirth">Place of birth</Label>
                    <Input
                        id="placeOfBirth"
                        placeholder="City, Country"
                        required
                        value={info.placeOfBirth}
                        onChange={(e) => update("placeOfBirth")(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                        id="gender"
                        required
                        value={info.gender}
                        onChange={(e) => update("gender")(e.target.value)}
                        className="h-11 w-full rounded-lg border border-primary/30 bg-[#0f0a1f]/60 px-4 text-sm text-foreground [color-scheme:dark] outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 invalid:text-foreground/40"
                    >
                        <option value="" disabled>
                            Select your gender
                        </option>
                        {GENDER_OPTIONS.map((option) => (
                            <option key={option} value={option} className="text-foreground">
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <Button type="submit" size="md" className="mt-2 w-full text-base">
                    Reveal my reading
                </Button>
            </form>
        </AuthCard>
    )
}

export default Onboarding
