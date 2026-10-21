import { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import MoonPhaseIcon from "@/components/astro/MoonPhaseIcon"
import InfoTip from "@/components/astro/InfoTip"
import ShareMenu from "@/components/share/ShareMenu"
import ShareFooter from "@/components/share/ShareFooter"
import TarotCardFlip from "@/components/tarot/TarotCardFlip"
import { getSunSign } from "@/lib/astro"
import { getDailyCard, getDailyMessage, getDayEnergy, localDateKey } from "@/lib/daily"
import type { OnboardingInfo } from "@/lib/onboarding"
import { playChime } from "@/lib/sound"

const REVEAL_KEY = "quoryn-daily-card-revealed"

function revealedToday(): boolean {
    try {
        return localStorage.getItem(REVEAL_KEY) === localDateKey()
    } catch {
        return false
    }
}

function rememberReveal() {
    try {
        localStorage.setItem(REVEAL_KEY, localDateKey())
    } catch {
        // The card will just be face down again next visit.
    }
}

// Personal daily message, the day's moon energy, and a tarot card of the day.
function TodayCard({ profile }: { profile: OnboardingInfo | null }) {
    const ref = useRef<HTMLDivElement>(null)
    const [revealed, setRevealed] = useState(revealedToday)

    const seed = profile ? `${profile.fullName}:${profile.dateOfBirth}` : "guest"
    const sign = profile ? getSunSign(profile.dateOfBirth) : null
    const energy = getDayEnergy()
    const card = getDailyCard(seed)
    const message = getDailyMessage(sign, seed)
    const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })

    function reveal() {
        setRevealed(true)
        rememberReveal()
        playChime()
    }

    return (
        <div
            ref={ref}
            className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-[#221a48] via-[#140e2b] to-[#0f0a1f] p-6 glow-purple md:p-8"
        >
            <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(155,143,255,0.25),transparent_70%)]" />

            <div className="relative flex items-center justify-between gap-3">
                <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-[0.25em] text-accent">Today</span>
                    <span className="font-heading text-xl">{dateLabel}</span>
                </div>
                <ShareMenu
                    target={ref}
                    fileName={`quoryn-today-${localDateKey()}`}
                    title="My Quoryn reading for today"
                    text={`My reading for ${dateLabel} ✨\n\n"${message}"\n\n${energy.phase}, Moon in ${energy.moonSign.name}.${revealed ? ` Card of the day: ${card.name}.` : ""}\n\nRead your sky with Quoryn.`}
                />
            </div>

            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <MoonPhaseIcon angle={energy.phaseAngle} size={56} />
                        <div className="flex flex-col">
                            <span className="flex items-center gap-1.5 font-heading text-lg">
                                {energy.phase} · Moon in {energy.moonSign.name} <InfoTip term="moonPhase" />
                            </span>
                            <span className="text-sm text-accent">{energy.guidance}</span>
                        </div>
                    </div>

                    <p className="font-heading text-2xl leading-snug font-light text-foreground opacity-100 md:text-3xl">"{message}"</p>

                    <AnimatePresence>
                        {revealed && (
                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col gap-1">
                                <span className="text-xs uppercase tracking-[0.2em] text-accent">Card of the day</span>
                                <span className="font-heading text-2xl">{card.name}</span>
                                <span className="text-sm text-foreground/65">A day of {card.meaning}.</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <TarotCardFlip card={card} revealed={revealed} onReveal={reveal} className="w-32 md:w-36" />
                    {!revealed && <span className="text-xs text-foreground/55">Tap to reveal your card</span>}
                </div>
            </div>

            <ShareFooter />
        </div>
    )
}

export default TodayCard
