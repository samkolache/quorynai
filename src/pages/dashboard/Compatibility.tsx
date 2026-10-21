import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { Heart, PenLine, Users } from "lucide-react"
import CompatibilityResult from "@/components/compatibility/CompatibilityResult"
import FriendsPanel from "@/components/compatibility/FriendsPanel"
import ChatPanel from "@/components/dashboard/ChatPanel"
import PageHeader from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loadOnboarding } from "@/lib/onboarding"
import { loadPartner, savePartner } from "@/lib/partner"
import type { Partner } from "@/lib/readings"
import { cn } from "@/lib/utils"

type Mode = "friends" | "manual"

const emptyPartner: Partner = { name: "", dateOfBirth: "", timeOfBirth: "" }

function Compatibility() {
    const [profile] = useState(loadOnboarding)
    const [mode, setMode] = useState<Mode>("friends")
    // The person currently being compared, from either a friend's account or the manual form.
    const [selected, setSelected] = useState<Partner | null>(null)
    const [form, setForm] = useState<Partner>(() => loadPartner() ?? emptyPartner)

    const today = new Date().toISOString().split("T")[0]

    function handleManualSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const next = { ...form, name: form.name.trim() }
        savePartner(next)
        setSelected(next)
    }

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <PageHeader
                eyebrow="Compatibility"
                icon={<Heart className="size-3.5" />}
                title="Written in both your stars"
                subtitle="Compare your chart with a partner, a friend, or a crush, and discover where your energies meet."
            />

            {!profile ? (
                <div className="flex flex-col items-start gap-4 rounded-2xl border border-primary/30 bg-secondary/50 p-6">
                    <p className="text-lg">Add your own birth details first so we can compare your charts.</p>
                    <Button render={<Link to="/dashboard/account" />} nativeButton={false} size="md">
                        Add my birth details
                    </Button>
                </div>
            ) : selected ? (
                <>
                    <CompatibilityResult
                        profile={profile}
                        partner={selected}
                        onBack={() => setSelected(null)}
                        backLabel={mode === "friends" ? "All friends" : "Compare someone else"}
                    />
                    <ChatPanel
                        key={`${selected.name}-${selected.dateOfBirth}`}
                        category="compatibility"
                        context={{ profile, partner: selected }}
                        detail={`With ${selected.name}`}
                        className="h-[460px]"
                        intro={`I've laid your chart beside ${selected.name}'s. What would you like to know about your connection?`}
                        suggestions={["What draws us together?", "Where might we clash?", `How can I support ${selected.name.split(" ")[0]} better?`]}
                        placeholder="Ask about your connection…"
                    />
                </>
            ) : (
                <>
                    {/* Two ways to pick someone: a linked friend, or typing their details */}
                    <div role="tablist" aria-label="How to compare" className="flex w-fit rounded-full border border-primary/40 bg-[#0f0a1f]/60 p-1">
                        {(
                            [
                                { id: "friends", label: "Friends", icon: <Users className="size-3.5" /> },
                                { id: "manual", label: "Enter manually", icon: <PenLine className="size-3.5" /> },
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={mode === tab.id}
                                onClick={() => setMode(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                                    mode === tab.id ? "bg-primary-hover text-white" : "text-foreground/70 hover:text-foreground",
                                )}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {mode === "friends" ? (
                        <FriendsPanel profile={profile} onCompare={(f) => setSelected({ name: f.name, dateOfBirth: f.dateOfBirth, timeOfBirth: f.timeOfBirth })} />
                    ) : (
                        <form onSubmit={handleManualSubmit} className="flex flex-col gap-5 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80 p-6 md:p-8">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-2xl font-normal">Who are we comparing with?</h2>
                                <span className="text-sm text-foreground/55">For anyone not on Quoryn yet: a crush, a partner, a celebrity.</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="partnerName">Their name</Label>
                                <Input id="partnerName" required placeholder="First name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="partnerDob">Their date of birth</Label>
                                    <Input id="partnerDob" type="date" max={today} required value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="partnerTime">
                                        Their time of birth <span className="text-foreground/40">(optional)</span>
                                    </Label>
                                    <Input id="partnerTime" type="time" value={form.timeOfBirth} onChange={(e) => setForm({ ...form, timeOfBirth: e.target.value })} />
                                </div>
                            </div>
                            <Button type="submit" size="md" className="w-fit">
                                <Heart className="size-4" /> Reveal our compatibility
                            </Button>
                        </form>
                    )}
                </>
            )}
        </div>
    )
}

export default Compatibility
