import { useMemo, useRef, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { motion } from "motion/react"
import { Check, Hash, Moon, Sparkles, Sun } from "lucide-react"
import ChartWheel from "@/components/astro/ChartWheel"
import InfoTip from "@/components/astro/InfoTip"
import PlanetList from "@/components/astro/PlanetList"
import ShareMenu from "@/components/share/ShareMenu"
import ShareFooter from "@/components/share/ShareFooter"
import TarotCardFlip from "@/components/tarot/TarotCardFlip"
import { Button } from "@/components/ui/button"
import { getBirthMoment, getLifePathNumber, getMoonSign, getPlanetPositions, getSunSign } from "@/lib/astro"
import { LIFE_PATH_MEANINGS, MOON_ELEMENT_TRAITS, SUN_SIGN_TRAITS, type GLOSSARY } from "@/lib/content"
import { getDailyCard } from "@/lib/daily"
import { loadOnboarding } from "@/lib/onboarding"
import { playChime } from "@/lib/sound"

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: "easeOut" },
} as const

// A real, personal reading shown right after onboarding, before we ask for an account.
function FirstReading() {
    const [profile] = useState(loadOnboarding)
    const [cardRevealed, setCardRevealed] = useState(false)
    const trioRef = useRef<HTMLDivElement>(null)
    const planets = useMemo(() => {
        const moment = profile && getBirthMoment(profile)
        return moment ? getPlanetPositions(moment) : null
    }, [profile])

    if (!profile) return <Navigate to="/onboarding" replace />

    const firstName = profile.fullName.split(" ")[0]
    const sun = getSunSign(profile.dateOfBirth)
    const moon = getMoonSign(profile)
    const lifePath = getLifePathNumber(profile.dateOfBirth)
    const card = getDailyCard(`${profile.fullName}:${profile.dateOfBirth}`)

    const trio: { icon: React.ReactNode; label: string; title: string; body: string; term: keyof typeof GLOSSARY }[] = [
        sun && { icon: <Sun className="size-4" />, label: "Sun sign", title: `${sun.symbol} ${sun.name}`, body: SUN_SIGN_TRAITS[sun.name], term: "sunSign" as const },
        moon && { icon: <Moon className="size-4" />, label: "Moon sign", title: `${moon.symbol} ${moon.name}`, body: MOON_ELEMENT_TRAITS[moon.element], term: "moonSign" as const },
        lifePath && { icon: <Hash className="size-4" />, label: "Life path", title: String(lifePath), body: LIFE_PATH_MEANINGS[lifePath], term: "lifePath" as const },
    ].filter((x) => !!x)

    return (
        <section className="mx-auto flex max-w-5xl flex-col gap-14 px-6 py-14 md:py-20">
            <motion.header {...fadeUp} className="flex flex-col items-center gap-5 text-center">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent">
                    <Sparkles className="size-3.5" /> Your first reading
                </span>
                <h1 className="text-glow text-4xl font-light leading-[1.15] md:text-6xl">
                    {firstName}, this is <br />
                    <span className="text-accent">your sky.</span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed">
                    We mapped the heavens at the moment you were born in {profile.placeOfBirth}. Here's what they reveal.
                </p>
            </motion.header>

            {/* Sun, moon, life path */}
            <motion.div {...fadeUp} ref={trioRef} className="flex flex-col gap-6 rounded-2xl border border-primary/40 bg-gradient-to-br from-[#221a48] via-[#140e2b] to-[#0f0a1f] p-6 glow-purple md:p-8">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-3xl font-light">Your cosmic signature</h2>
                    <ShareMenu
                        target={trioRef}
                        fileName="quoryn-my-signs"
                        title={`${firstName}'s cosmic signature`}
                        text={`My cosmic signature ✨\n\n${trio.map((t) => `${t.label}: ${t.title}`).join("\n")}\n\nRead your sky with Quoryn.`}
                    />
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    {trio.map((t) => (
                        <div key={t.label} className="flex flex-col gap-2 rounded-xl border border-primary/25 bg-secondary/40 p-5">
                            <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                                {t.icon} {t.label} <InfoTip term={t.term} />
                            </span>
                            <span className="font-heading text-3xl">{t.title}</span>
                            <p className="leading-relaxed">{t.body}</p>
                        </div>
                    ))}
                </div>
                <ShareFooter />
            </motion.div>

            {/* Chart */}
            {planets && (
                <motion.div {...fadeUp} className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
                    <ChartWheel planets={planets} className="mx-auto w-full max-w-[440px]" />
                    <div className="flex flex-col gap-5">
                        <h2 className="text-3xl font-light">Where your planets were</h2>
                        <p className="leading-relaxed">Every planet in your chart colors a different part of your life, from how you love (Venus) to how you take action (Mars).</p>
                        <PlanetList planets={planets} />
                    </div>
                </motion.div>
            )}

            {/* Card of the day */}
            <motion.div {...fadeUp} className="flex flex-col items-center gap-6 text-center">
                <h2 className="text-3xl font-light">A card for you today</h2>
                <TarotCardFlip
                    card={card}
                    revealed={cardRevealed}
                    onReveal={() => {
                        setCardRevealed(true)
                        playChime()
                    }}
                    className="w-40"
                />
                {cardRevealed ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col gap-1">
                        <span className="font-heading text-2xl">{card.name}</span>
                        <span className="max-w-md text-foreground/65">Today is about {card.meaning}. Ask your guide what it means for you.</span>
                    </motion.div>
                ) : (
                    <span className="text-sm text-foreground/55">Tap the card to turn it over</span>
                )}
            </motion.div>

            {/* Save it */}
            <motion.div {...fadeUp} className="flex flex-col items-center gap-6 rounded-2xl border border-primary/40 bg-secondary/50 px-6 py-10 text-center backdrop-blur-sm">
                <h2 className="text-glow text-3xl font-light md:text-4xl">Save your reading and meet your guide</h2>
                <ul className="flex flex-col gap-2 text-left">
                    {["Keep your chart and readings in one place", "Ask your personal guide anything, anytime", "A new message and card every day"].map((b) => (
                        <li key={b} className="flex items-center gap-2 text-foreground/85">
                            <Check className="size-4 text-accent" /> {b}
                        </li>
                    ))}
                </ul>
                <div className="flex flex-col items-center gap-3">
                    <Button render={<Link to="/signup" />} nativeButton={false} size="cta" className="animate-pulse-glow">
                        Create my free account
                    </Button>
                    <Link to="/onboarding" className="text-sm text-foreground/55 hover:text-accent">
                        Edit my birth details
                    </Link>
                </div>
            </motion.div>
        </section>
    )
}

export default FirstReading
