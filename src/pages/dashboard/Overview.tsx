import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Flame, Hash, Sun } from "lucide-react"
import InfoTip from "@/components/astro/InfoTip"
import { CATEGORIES } from "@/components/dashboard/categories"
import TiltCard from "@/components/dashboard/TiltCard"
import TodayCard from "@/components/dashboard/TodayCard"
import { getLifePathNumber, getSunSign } from "@/lib/astro"
import { getStreak, loadNotes } from "@/lib/journal"
import { loadOnboarding } from "@/lib/onboarding"
import type { GLOSSARY } from "@/lib/content"

function greeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
}

function Overview() {
    const [profile] = useState(loadOnboarding)
    const [streak] = useState(() => getStreak(loadNotes()))
    const firstName = profile?.fullName.split(" ")[0]
    const sign = profile ? getSunSign(profile.dateOfBirth) : null
    const lifePath = profile ? getLifePathNumber(profile.dateOfBirth) : null

    const stats: { icon: React.ReactNode; label: string; value: string; term: keyof typeof GLOSSARY; to?: string }[] = [
        { icon: <Sun className="size-4" />, label: "Sun sign", value: sign ? `${sign.symbol} ${sign.name}` : "Add your birth date", term: "sunSign" },
        { icon: <Hash className="size-4" />, label: "Life path", value: lifePath ? String(lifePath) : "Add your birth date", term: "lifePath" },
        {
            icon: <Flame className="size-4" />,
            label: "Journal streak",
            value: streak ? `${streak} day${streak === 1 ? "" : "s"}` : "Start today",
            term: "streak",
            to: "/dashboard/manifestation",
        },
    ]

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
            <header className="flex flex-col gap-3">
                <p className="font-heading text-lg italic text-accent opacity-100">{greeting()}</p>
                <h1 className="text-glow text-4xl font-light md:text-5xl">{firstName ? `Welcome back, ${firstName}` : "Welcome back"}</h1>
                <p className="max-w-2xl text-lg leading-relaxed">The sky has shifted since you were last here. Here's what today holds for you.</p>
            </header>

            <TodayCard profile={profile} />

            <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((s) => {
                    const content = (
                        <>
                            <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                                {s.icon} {s.label} <InfoTip term={s.term} />
                            </span>
                            <span className="font-heading text-2xl">{s.value}</span>
                        </>
                    )
                    const cls = "flex flex-col gap-2 rounded-2xl border border-primary/30 bg-secondary/50 p-5 backdrop-blur-sm"
                    return s.to ? (
                        <Link key={s.label} to={s.to} className={`${cls} transition-colors hover:border-primary`}>
                            {content}
                        </Link>
                    ) : (
                        <div key={s.label} className={cls}>
                            {content}
                        </div>
                    )
                })}
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-light">Choose your path</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    {CATEGORIES.map((c) => (
                        <TiltCard key={c.id}>
                            <Link
                                to={c.path}
                                className="group flex h-full flex-col gap-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80 p-6 transition-[border-color,box-shadow] hover:border-primary hover:glow-purple"
                            >
                                <span className="flex size-11 items-center justify-center rounded-full border border-primary/40 bg-secondary text-accent">{c.icon}</span>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-normal">{c.label}</h3>
                                    <p>{c.blurb}</p>
                                </div>
                                <span className="mt-auto flex items-center gap-2 text-sm text-accent">
                                    Begin reading <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Overview
