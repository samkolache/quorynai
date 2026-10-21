import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { CreditCard, Crown, Download, KeyRound, LogOut, Mail, Pencil, Settings2, Trash2, UserRound, Volume2 } from "lucide-react"
import ConfirmDialog from "@/components/dashboard/ConfirmDialog"
import { useInstallPrompt } from "@/hooks/useInstallPrompt"
import { playChime, setSoundsEnabled, soundsEnabled } from "@/lib/sound"
import PageHeader from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deleteAccount, loadAccountEmail, saveAccountEmail, signOut } from "@/lib/account"
import { getSunSign } from "@/lib/astro"
import { GENDER_OPTIONS, loadOnboarding, saveOnboarding, type OnboardingInfo } from "@/lib/onboarding"
import { PLANS } from "@/lib/plans"
import { FREE_PLAN, loadSubscription, nextRenewal, saveSubscription, type Billing, type Subscription } from "@/lib/subscription"
import { cn } from "@/lib/utils"

const MIN_PASSWORD_LENGTH = 8

const emptyInfo: OnboardingInfo = { fullName: "", dateOfBirth: "", timeOfBirth: "", placeOfBirth: "", gender: "" }

const selectClass =
    "h-11 w-full rounded-lg border border-primary/30 bg-[#0f0a1f]/60 px-4 text-sm text-foreground [color-scheme:dark] outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"

function formatDate(value: string) {
    if (!value) return ""
    // Parse as local time so the day doesn't shift across time zones.
    const [y, m, d] = value.split("-").map(Number)
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
}

function formatTime(value: string) {
    if (!value) return ""
    const [h, m] = value.split(":").map(Number)
    return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
}

function Section({ id, icon, title, action, children }: { id?: string; icon: ReactNode; title: string; action?: ReactNode; children: ReactNode }) {
    return (
        <section id={id} className="scroll-mt-24 flex flex-col gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80 p-6 backdrop-blur-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-2xl font-normal">
                    <span className="text-accent">{icon}</span> {title}
                </h2>
                {action}
            </div>
            {children}
        </section>
    )
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.2em] text-accent">{label}</dt>
            <dd className={value ? "font-heading text-xl" : "font-heading text-xl italic text-foreground/40"}>{value || "Not set"}</dd>
        </div>
    )
}

function BirthDetails() {
    const [profile, setProfile] = useState(loadOnboarding)
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState<OnboardingInfo>(profile ?? emptyInfo)

    const today = new Date().toISOString().split("T")[0]
    const sign = profile ? getSunSign(profile.dateOfBirth) : null
    const update = (field: keyof OnboardingInfo) => (value: string) => setForm((f) => ({ ...f, [field]: value }))

    function startEditing() {
        setForm(profile ?? emptyInfo)
        setEditing(true)
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const next = { ...form, fullName: form.fullName.trim(), placeOfBirth: form.placeOfBirth.trim() }
        // TODO: save to the user's account on the backend once one exists.
        saveOnboarding(next)
        setProfile(next)
        setEditing(false)
        toast.success("Birth details updated. Your readings will use them from now on.")
    }

    const editButton = !editing && (
        <Button variant="outline" size="sm" onClick={startEditing} className="bg-transparent px-3">
            <Pencil className="size-3.5" /> Edit
        </Button>
    )

    if (editing) {
        return (
            <Section icon={<UserRound className="size-5" />} title="Birth details">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input id="fullName" autoComplete="name" required value={form.fullName} onChange={(e) => update("fullName")(e.target.value)} />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="dateOfBirth">Date of birth</Label>
                            <Input id="dateOfBirth" type="date" max={today} required value={form.dateOfBirth} onChange={(e) => update("dateOfBirth")(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="timeOfBirth">Time of birth</Label>
                            <Input id="timeOfBirth" type="time" required value={form.timeOfBirth} onChange={(e) => update("timeOfBirth")(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="placeOfBirth">Place of birth</Label>
                            <Input id="placeOfBirth" placeholder="City, Country" required value={form.placeOfBirth} onChange={(e) => update("placeOfBirth")(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <select id="gender" required value={form.gender} onChange={(e) => update("gender")(e.target.value)} className={selectClass}>
                                <option value="" disabled>
                                    Select your gender
                                </option>
                                {GENDER_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" size="md">Save changes</Button>
                        <Button type="button" variant="ghost" size="md" onClick={() => setEditing(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Section>
        )
    }

    return (
        <Section icon={<UserRound className="size-5" />} title="Birth details" action={editButton}>
            {profile ? (
                <dl className="grid gap-6 sm:grid-cols-2">
                    <Detail label="Full name" value={profile.fullName} />
                    <Detail label="Sun sign" value={sign ? `${sign.symbol} ${sign.name}` : ""} />
                    <Detail label="Date of birth" value={formatDate(profile.dateOfBirth)} />
                    <Detail label="Time of birth" value={formatTime(profile.timeOfBirth)} />
                    <Detail label="Place of birth" value={profile.placeOfBirth} />
                    <Detail label="Gender" value={profile.gender} />
                </dl>
            ) : (
                <p className="text-lg">We don't have your birth details yet. Add them so every reading is based on your chart.</p>
            )}
        </Section>
    )
}

function LoginAndSecurity() {
    const [email, setEmail] = useState(loadAccountEmail)
    const [editingEmail, setEditingEmail] = useState(false)
    const [emailDraft, setEmailDraft] = useState("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")

    function saveEmail(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // TODO: update the email (and send a verification link) on the backend once one exists.
        const next = emailDraft.trim()
        saveAccountEmail(next)
        setEmail(next)
        setEditingEmail(false)
        toast.success("Email address updated.")
    }

    function savePassword(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            setPasswordError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
            return
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords don't match.")
            return
        }
        // TODO: verify currentPassword and save newPassword on the backend once one exists.
        setPasswordError("")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        toast.success("Password updated.")
    }

    return (
        <Section icon={<KeyRound className="size-5" />} title="Login & security">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                    <Mail className="size-3.5" /> Email address
                </div>
                {editingEmail ? (
                    <form onSubmit={saveEmail} className="flex flex-col gap-3 sm:flex-row">
                        <Input
                            type="email"
                            autoComplete="email"
                            aria-label="New email address"
                            placeholder="you@example.com"
                            required
                            value={emailDraft}
                            onChange={(e) => setEmailDraft(e.target.value)}
                            className="sm:max-w-sm"
                        />
                        <div className="flex gap-2">
                            <Button type="submit" size="md">Save</Button>
                            <Button type="button" variant="ghost" size="md" onClick={() => setEditingEmail(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className={email ? "font-heading text-xl" : "font-heading text-xl italic text-foreground/40"}>
                            {email || "Not set"}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent px-3"
                            onClick={() => {
                                setEmailDraft(email)
                                setEditingEmail(true)
                            }}
                        >
                            <Pencil className="size-3.5" /> Change email
                        </Button>
                    </div>
                )}
            </div>

            <div className="h-px bg-primary/20" />

            <form onSubmit={savePassword} className="flex flex-col gap-5">
                <h3 className="text-xl font-normal">Change password</h3>
                <div className="flex flex-col gap-2 sm:max-w-sm">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input id="currentPassword" type="password" autoComplete="current-password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="confirmNewPassword">Verify new password</Label>
                        <Input
                            id="confirmNewPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            aria-invalid={passwordError ? true : undefined}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
                {passwordError && (
                    <p role="alert" className="text-sm text-destructive opacity-100">
                        {passwordError}
                    </p>
                )}
                <Button type="submit" size="md" className="w-fit">
                    Update password
                </Button>
            </form>
        </Section>
    )
}

function priceLabel(plan: string, billing: Billing) {
    const p = PLANS.find((x) => x.accessType === plan)
    if (!p || plan === FREE_PLAN) return "Free"
    return billing === "annual" ? `${p.annualPrice}/mo, billed yearly` : `${p.price}/month`
}

function ManageSubscription() {
    const [current, setCurrent] = useState<Subscription>(loadSubscription)
    const [selectedPlan, setSelectedPlan] = useState(current.plan)
    const [billing, setBilling] = useState<Billing>(current.billing)
    const [confirmingCancel, setConfirmingCancel] = useState(false)

    const isPaid = current.plan !== FREE_PLAN
    // Billing cycle only matters for paid plans, so switching to the free plan ignores it.
    const changed = selectedPlan !== current.plan || (selectedPlan !== FREE_PLAN && billing !== current.billing)
    const renewal = nextRenewal(current).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })

    function apply(next: Subscription, note: string) {
        // TODO: send the user to checkout (or update the plan) with the payment provider once billing is set up.
        saveSubscription(next)
        setCurrent(next)
        setSelectedPlan(next.plan)
        setBilling(next.billing)
        toast.success(note)
    }

    function confirmChange() {
        apply(
            { plan: selectedPlan, billing, startedAt: new Date().toISOString() },
            selectedPlan === FREE_PLAN ? "You're now on the free Seeker plan." : `You're now on the ${selectedPlan} plan.`,
        )
    }

    function cancelSubscription() {
        apply({ plan: FREE_PLAN, billing: "monthly", startedAt: new Date().toISOString() }, "Your subscription was canceled. You're now on the free Seeker plan.")
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-normal">Subscription</h3>
                    <p>Change your plan or billing cycle at any time.</p>
                </div>
                <div className="flex flex-col items-start gap-1 sm:items-end">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-sm">
                        <Crown className="size-3.5 text-accent" /> {current.plan}
                    </span>
                    <span className="text-sm text-foreground/60">
                        {priceLabel(current.plan, current.billing)}
                        {isPaid && ` · Renews ${renewal}`}
                    </span>
                </div>
            </div>

            {/* Billing cycle */}
            <div role="radiogroup" aria-label="Billing cycle" className="flex w-fit rounded-full border border-primary/40 bg-[#0f0a1f]/60 p-1">
                {(["monthly", "annual"] as const).map((b) => (
                    <button
                        key={b}
                        type="button"
                        role="radio"
                        aria-checked={billing === b}
                        onClick={() => setBilling(b)}
                        className={cn(
                            "rounded-full px-4 py-1.5 text-sm transition-colors",
                            billing === b ? "bg-primary-hover text-white" : "text-foreground/70 hover:text-foreground",
                        )}
                    >
                        {b === "monthly" ? "Monthly" : "Annual"}
                        {b === "annual" && <span className={cn("ml-2 text-xs font-semibold", billing === b ? "text-white/80" : "text-accent")}>-20%</span>}
                    </button>
                ))}
            </div>

            {/* Plan options */}
            <div role="radiogroup" aria-label="Plan" className="grid gap-3 sm:grid-cols-3">
                {PLANS.map((p) => {
                    const selected = selectedPlan === p.accessType
                    const isCurrent = current.plan === p.accessType
                    const price = billing === "annual" ? p.annualPrice : p.price
                    return (
                        <button
                            key={p.accessType}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setSelectedPlan(p.accessType)}
                            className={cn(
                                "flex flex-col gap-2 rounded-xl border p-4 text-left transition-all",
                                selected ? "border-primary bg-primary/15 glow-purple" : "border-primary/25 bg-secondary/40 hover:border-primary/60",
                            )}
                        >
                            <span className="flex items-center justify-between gap-2">
                                <span className="font-heading text-xl">{p.accessType}</span>
                                {isCurrent && <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[0.7rem] uppercase tracking-wider text-accent">Current</span>}
                            </span>
                            <span className="text-sm">
                                <span className="text-lg font-semibold">{price}</span>
                                {p.accessType !== FREE_PLAN && <span className="text-foreground/60">{billing === "annual" ? "/mo, billed yearly" : "/month"}</span>}
                            </span>
                            <span className="text-xs text-foreground/55">{p.benefits[0]}</span>
                        </button>
                    )
                })}
            </div>

            {changed && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
                    <span className="flex-1 text-sm text-foreground/85">
                        Switch to <strong className="font-semibold">{selectedPlan}</strong> ({priceLabel(selectedPlan, billing)})?
                    </span>
                    <Button size="md" onClick={confirmChange}>
                        Confirm change
                    </Button>
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => {
                            setSelectedPlan(current.plan)
                            setBilling(current.billing)
                        }}
                    >
                        Never mind
                    </Button>
                </div>
            )}


            {/* Payment method */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-secondary/30 p-4">
                <span className="flex items-center gap-3 text-sm text-foreground/75">
                    <CreditCard className="size-4 text-accent" /> No payment method on file
                </span>
                {/* TODO: open the payment provider's card form once billing is set up. */}
                <Button variant="outline" size="sm" disabled className="bg-transparent px-3">
                    Add payment method
                </Button>
            </div>

            {isPaid && (
                <button
                    type="button"
                    onClick={() => setConfirmingCancel(true)}
                    className="w-fit text-sm text-foreground/55 underline-offset-4 hover:text-destructive hover:underline"
                >
                    Cancel subscription
                </button>
            )}

            <ConfirmDialog
                open={confirmingCancel}
                onOpenChange={setConfirmingCancel}
                title={`Cancel your ${current.plan} plan?`}
                description="You'll move to the free Seeker plan and lose unlimited readings. You can upgrade again anytime."
                confirmLabel="Yes, cancel"
                cancelLabel="Keep my plan"
                onConfirm={cancelSubscription}
            />
        </div>
    )
}

function ManageAccount() {
    const navigate = useNavigate()
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    function handleSignOut() {
        signOut()
        navigate("/")
    }

    function handleDelete() {
        deleteAccount()
        navigate("/")
    }

    return (
        <Section icon={<LogOut className="size-5" />} title="Manage account">
            <div id="subscription" className="scroll-mt-24">
                <ManageSubscription />
            </div>

            <div className="h-px bg-primary/20" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-normal">Sign out</h3>
                    <p>Sign out of Quoryn on this device.</p>
                </div>
                <Button variant="outline" size="md" onClick={handleSignOut} className="bg-transparent">
                    <LogOut className="size-4" /> Sign out
                </Button>
            </div>

            <div className="h-px bg-primary/20" />

            <div className="flex flex-col gap-4 rounded-xl border border-destructive/40 bg-destructive/5 p-5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-normal text-destructive">Delete account</h3>
                    <p>Permanently delete your account, birth details, readings, and journal entries. This can't be undone.</p>
                </div>
                <Button variant="destructive" size="md" onClick={() => setConfirmingDelete(true)} className="w-fit">
                    <Trash2 className="size-4" /> Delete account
                </Button>
                <ConfirmDialog
                    open={confirmingDelete}
                    onOpenChange={setConfirmingDelete}
                    title="Delete your account?"
                    description="Your birth details, readings, journal, and plan will be erased. This can't be undone."
                    confirmLabel={<><Trash2 className="size-4" /> Delete my account</>}
                    cancelLabel="Keep my account"
                    onConfirm={handleDelete}
                />
            </div>
        </Section>
    )
}

function Preferences() {
    const [sounds, setSounds] = useState(soundsEnabled)
    const install = useInstallPrompt()

    function toggleSounds() {
        const next = !sounds
        setSounds(next)
        setSoundsEnabled(next)
        if (next) playChime()
    }

    return (
        <Section icon={<Settings2 className="size-5" />} title="Preferences">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="flex items-center gap-2 text-xl font-normal">
                        <Volume2 className="size-4 text-accent" /> Sounds
                    </h3>
                    <p>A soft chime when cards turn over.</p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={sounds}
                    aria-label="Sounds"
                    onClick={toggleSounds}
                    className={`relative h-7 w-12 rounded-full border transition-colors ${sounds ? "border-primary bg-primary" : "border-primary/40 bg-[#0f0a1f]/60"}`}
                >
                    <span className={`absolute top-0.5 size-5 rounded-full bg-foreground transition-all ${sounds ? "left-6" : "left-0.5"}`} />
                </button>
            </div>

            <div className="h-px bg-primary/20" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="flex items-center gap-2 text-xl font-normal">
                        <Download className="size-4 text-accent" /> Quoryn on your home screen
                    </h3>
                    <p>{install ? "Install Quoryn for one-tap access to your daily reading." : "Use your browser's \"Add to Home Screen\" or install option to keep Quoryn one tap away."}</p>
                </div>
                {install && (
                    <Button variant="outline" size="md" onClick={install} className="bg-transparent">
                        <Download className="size-4" /> Install app
                    </Button>
                )}
            </div>
        </Section>
    )
}

function Account() {
    const { hash } = useLocation()

    // Links like /dashboard/account#subscription jump straight to that section.
    useEffect(() => {
        if (!hash) return
        const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 350)
        return () => clearTimeout(t)
    }, [hash])

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <PageHeader
                eyebrow="Account"
                icon={<UserRound className="size-3.5" />}
                title="Your account"
                subtitle="Review the details behind your readings, update your login, and manage your account."
            />
            <BirthDetails />
            <LoginAndSecurity />
            <Preferences />
            <ManageAccount />
        </div>
    )
}

export default Account
