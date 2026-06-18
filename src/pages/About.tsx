import { Sparkles, Layers, Flame, Eye, Moon } from "lucide-react"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"

const pillars = [
    { icon: <Sparkles className="size-4" />, label: "Astrology", angle: -90, radius: 210 },
    { icon: <Layers className="size-4" />, label: "Tarot", angle: 0, radius: 140 },
    { icon: <Flame className="size-4" />, label: "Manifestation", angle: 90, radius: 210 },
    { icon: <Eye className="size-4" />, label: "Psychic", angle: 180, radius: 140 },
]

// Convert a polar position (angle in degrees, radius in px) to a centered offset.
function nodeStyle(angle: number, radius: number) {
    const rad = (angle * Math.PI) / 180
    return {
        left: `calc(50% + ${Math.cos(rad) * radius}px)`,
        top: `calc(50% + ${Math.sin(rad) * radius}px)`,
        transform: "translate(-50%, -50%)",
    }
}

function About() {
    return (
        <section className="relative mx-auto flex min-h-[calc(100vh-68px)] max-w-6xl items-center px-6 py-12">
            <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
                {/* ── Manifesto ───────────────────────────── */}
                <div className="flex flex-col gap-7">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent">
                        <Moon className="size-3.5" /> Our chart
                    </span>

                    <h1 className="text-glow text-5xl font-light leading-[1.1] md:text-6xl">
                        We read the sky <br /> so you can read <br />
                        <span className="text-accent">yourself.</span>
                    </h1>

                    <div className="flex max-w-lg flex-col gap-4">
                        <p className="text-lg leading-relaxed">
                            Quoryn began with a simple belief — that the wisdom of the stars
                            shouldn't sit behind an appointment or a waiting room.
                        </p>
                        <p className="leading-relaxed">
                            We blend ancient practice with intelligent technology to give you
                            readings that feel personal, present, and unmistakably yours.
                            Astrology, tarot, manifestation, and psychic insight — woven into one
                            living conversation that knows your sky.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <Button
                            render={<Link to="/" />}
                            className="bg-primary h-auto px-7 py-3.5 font-heading text-base animate-pulse-glow"
                        >
                            Begin your free reading
                        </Button>
                        <span className="font-heading text-sm italic text-foreground/50">
                            — written under a waxing moon
                        </span>
                    </div>
                </div>

                {/* ── Orbital constellation ───────────────── */}
                <div className="relative mx-auto hidden aspect-square w-full max-w-[460px] lg:block">
                    {/* concentric rings */}
                    <div className="absolute inset-0 rounded-full border border-primary/15" />
                    <div className="absolute inset-[70px] animate-orbit-reverse rounded-full border border-dashed border-primary/25" />
                    <div className="absolute inset-[140px] animate-orbit-slow rounded-full border border-primary/20" />

                    {/* faint radial wash */}
                    <div className="absolute inset-[120px] rounded-full bg-[radial-gradient(circle,rgba(83,74,183,0.25),transparent_70%)] blur-xl" />

                    {/* central core */}
                    <div className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-gradient-to-br from-[#2a1f5c] to-[#0f0a1f] glow-purple animate-pulse-glow">
                        <Moon className="size-9 text-accent text-glow" />
                    </div>

                    {/* pillar nodes orbiting the core */}
                    {pillars.map((p) => (
                        <div
                            key={p.label}
                            className="absolute flex flex-col items-center gap-2"
                            style={nodeStyle(p.angle, p.radius)}
                        >
                            <div className="flex size-11 items-center justify-center rounded-full border border-primary/40 bg-secondary/80 text-accent backdrop-blur-sm transition-all hover:glow-purple hover:border-primary">
                                {p.icon}
                            </div>
                            <span className="font-heading text-xs tracking-wide text-foreground/70">
                                {p.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default About
