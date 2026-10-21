import { useRef } from "react"
import { motion } from "motion/react"
import { ArrowLeft } from "lucide-react"
import ShareFooter from "@/components/share/ShareFooter"
import ShareMenu from "@/components/share/ShareMenu"
import { Button } from "@/components/ui/button"
import { getCompatibility } from "@/lib/compatibility"
import type { OnboardingInfo } from "@/lib/onboarding"
import type { Partner } from "@/lib/readings"

function ScoreRing({ score }: { score: number }) {
    const r = 52
    const circumference = 2 * Math.PI * r
    return (
        <div className="relative size-36">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(83,74,183,0.25)" strokeWidth="8" />
                <motion.circle
                    cx="60"
                    cy="60"
                    r={r}
                    fill="none"
                    stroke="url(#score-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                />
                <defs>
                    <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#9b8fff" />
                        <stop offset="100%" stopColor="#f0abfc" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-4xl">{score}%</span>
                <span className="text-xs uppercase tracking-[0.2em] text-accent">Harmony</span>
            </div>
        </div>
    )
}

function Facet({ label, value, note }: { label: string; value: number; note: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
                <span className="text-sm text-foreground/85">{label}</span>
                <span className="font-heading text-lg">{value}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-primary/20">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#9b8fff] to-[#f0abfc]"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
                />
            </div>
            <span className="text-xs text-foreground/50">{note}</span>
        </div>
    )
}

type CompatibilityResultProps = {
    profile: OnboardingInfo
    partner: Partner
    onBack: () => void
    backLabel: string
}

function CompatibilityResult({ profile, partner, onBack, backLabel }: CompatibilityResultProps) {
    const resultRef = useRef<HTMLDivElement>(null)
    const result = getCompatibility(profile, partner)
    const firstName = profile.fullName.split(" ")[0]
    if (!result) return null

    return (
            <div ref={resultRef} className="flex flex-col gap-7 rounded-2xl border border-primary/40 bg-gradient-to-br from-[#221a48] via-[#140e2b] to-[#0f0a1f] p-6 glow-purple md:p-8">
                <div className="flex items-center justify-between gap-3" data-share-exclude>
                    <Button variant="ghost" size="sm" onClick={onBack} className="px-2.5 text-foreground/70">
                        <ArrowLeft className="size-3.5" /> {backLabel}
                    </Button>
                    <ShareMenu
                        target={resultRef}
                        fileName="quoryn-compatibility"
                        title={`${firstName} & ${partner.name}`}
                        text={`${firstName} & ${partner.name}: ${result.overall}% cosmic harmony ✨\n\n${result.you.sun.name} sun meets ${result.them.sun.name} sun. "${result.summary}"\n\nCheck your compatibility on Quoryn.`}
                    />
                </div>

                <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
                    {[
                        { name: firstName, data: result.you },
                        { name: partner.name, data: result.them },
                    ].map(({ name, data }, i) => (
                        <div key={name + i} className={`flex flex-col items-center gap-2 text-center ${i === 1 ? "md:order-3" : ""}`}>
                            <span className="flex size-20 items-center justify-center rounded-full border border-accent/50 bg-primary/15 text-4xl">{data.sun.symbol}</span>
                            <span className="font-heading text-2xl">{name}</span>
                            <span className="text-sm text-foreground/60">
                                {data.sun.name} sun{data.moon ? ` · ${data.moon.name} moon` : ""}
                            </span>
                        </div>
                    ))}
                    <div className="flex justify-center md:order-2">
                        <ScoreRing score={result.overall} />
                    </div>
                </div>

                <p className="text-center font-heading text-2xl leading-snug font-light opacity-100">"{result.summary}"</p>

                <div className="grid gap-6 sm:grid-cols-3">
                    <Facet label="Core connection" value={result.core} note={`${result.you.sun.element} and ${result.them.sun.element} suns`} />
                    <Facet
                        label="Emotional bond"
                        value={result.emotional}
                        note={result.you.moon && result.them.moon ? `${result.you.moon.element} and ${result.them.moon.element} moons` : "Based on your sun signs"}
                    />
                    <Facet
                        label="Life paths"
                        value={result.path}
                        note={result.you.lifePath && result.them.lifePath ? `Paths ${result.you.lifePath} and ${result.them.lifePath}` : "Based on birth dates"}
                    />
                </div>

                <ShareFooter />
            </div>
    )
}

export default CompatibilityResult
