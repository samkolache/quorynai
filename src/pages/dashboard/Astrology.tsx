import { useMemo, useRef, useState } from "react"
import { Hash, MapPin, Moon, Sparkles, Sun } from "lucide-react"
import ChartWheel from "@/components/astro/ChartWheel"
import InfoTip from "@/components/astro/InfoTip"
import PlanetList from "@/components/astro/PlanetList"
import ChatPanel from "@/components/dashboard/ChatPanel"
import PageHeader from "@/components/dashboard/PageHeader"
import ShareMenu from "@/components/share/ShareMenu"
import ShareFooter from "@/components/share/ShareFooter"
import { getBirthMoment, getLifePathNumber, getMoonSign, getPlanetPositions, getSunSign } from "@/lib/astro"
import type { GLOSSARY } from "@/lib/content"
import { LIFE_PATH_MEANINGS } from "@/lib/content"
import { loadOnboarding } from "@/lib/onboarding"

function Astrology() {
    const [profile] = useState(loadOnboarding)
    const chartRef = useRef<HTMLDivElement>(null)
    const sign = profile ? getSunSign(profile.dateOfBirth) : null
    const moon = profile ? getMoonSign(profile) : null
    const lifePath = profile ? getLifePathNumber(profile.dateOfBirth) : null
    const planets = useMemo(() => {
        const moment = profile && getBirthMoment(profile)
        return moment ? getPlanetPositions(moment) : null
    }, [profile])

    const details: { icon: React.ReactNode; label: string; value: string; note: string; term?: keyof typeof GLOSSARY }[] = [
        { icon: <Sun className="size-4" />, label: "Sun sign", value: sign ? `${sign.symbol} ${sign.name}` : "Unknown", note: sign ? `${sign.element} sign` : "Add your birth date", term: "sunSign" },
        { icon: <Moon className="size-4" />, label: "Moon sign", value: moon ? `${moon.symbol} ${moon.name}` : "Unknown", note: moon ? `${moon.element} moon` : "Add your birth date", term: "moonSign" },
        { icon: <Hash className="size-4" />, label: "Life path", value: lifePath ? String(lifePath) : "Unknown", note: lifePath ? LIFE_PATH_MEANINGS[lifePath].split(":")[0] : "From your full birth date", term: "lifePath" },
        { icon: <MapPin className="size-4" />, label: "Born in", value: profile?.placeOfBirth || "Unknown", note: profile?.timeOfBirth ? `at ${profile.timeOfBirth}` : "Birth time not set" },
    ]

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <PageHeader
                eyebrow="Astrology & Numerology"
                icon={<Sparkles className="size-3.5" />}
                title="Your sky, your numbers"
                subtitle="Ask about your chart, a transit, your compatibility, or what your numbers say about the year ahead."
            />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {details.map((d) => (
                    <div key={d.label} className="flex flex-col gap-1.5 rounded-2xl border border-primary/30 bg-secondary/50 p-5 backdrop-blur-sm">
                        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                            {d.icon} {d.label} {d.term && <InfoTip term={d.term} />}
                        </span>
                        <span className="font-heading text-2xl">{d.value}</span>
                        <span className="text-sm text-foreground/50">{d.note}</span>
                    </div>
                ))}
            </div>

            {planets && (
                <div ref={chartRef} className="flex flex-col gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80 p-6 md:p-8">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-light">Your birth chart</h2>
                            <span className="text-sm text-foreground/55">Tap a planet to see where it sits</span>
                        </div>
                        <ShareMenu
                            target={chartRef}
                            fileName="quoryn-birth-chart"
                            title="My birth chart"
                            text={`My birth chart ✨\n\n${planets.map((p) => `${p.body}: ${p.degree}° ${p.sign.name}`).join("\n")}\n\nRead your sky with Quoryn.`}
                        />
                    </div>
                    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
                        <ChartWheel planets={planets} className="mx-auto w-full max-w-[420px]" />
                        <PlanetList planets={planets} />
                    </div>
                    <ShareFooter />
                </div>
            )}

            <ChatPanel
                category="astrology"
                context={{ profile }}
                className="h-[520px]"
                intro="I've read your birth chart. What would you like to explore about your sky or your numbers today?"
                suggestions={["What does my sun sign say about me?", "What does my life path number mean?", "What should I focus on this month?"]}
                placeholder="Ask about your chart or numbers…"
            />
        </div>
    )
}

export default Astrology
