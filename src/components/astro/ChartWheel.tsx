import { useState } from "react"
import { ZODIAC, type Element, type PlanetPosition } from "@/lib/astro"

const ELEMENT_TINT: Record<Element, string> = {
    Fire: "rgba(255,138,101,0.16)",
    Earth: "rgba(129,199,132,0.14)",
    Air: "rgba(155,143,255,0.16)",
    Water: "rgba(100,181,246,0.16)",
}

// Major aspects: the angle between two planets, how far off it may be, and its line color.
const ASPECTS = [
    { angle: 0, orb: 8, color: "rgba(232,224,255,0.0)" }, // conjunctions sit side by side; no line
    { angle: 60, orb: 5, color: "rgba(100,181,246,0.45)" },
    { angle: 90, orb: 6, color: "rgba(255,138,101,0.5)" },
    { angle: 120, orb: 7, color: "rgba(129,199,132,0.5)" },
    { angle: 180, orb: 8, color: "rgba(255,138,101,0.5)" },
]

const SIZE = 400
const C = SIZE / 2
const R_OUTER = 192
const R_SIGNS = 156
const R_PLANETS = 128
const R_ASPECTS = 100

// Astrological charts put 0° Aries on the left and run counterclockwise.
function polar(longitude: number, radius: number) {
    const rad = ((180 + longitude) * Math.PI) / 180
    return { x: C + radius * Math.cos(rad), y: C - radius * Math.sin(rad) }
}

function segmentPath(start: number, end: number, r1: number, r2: number) {
    const a = polar(start, r1)
    const b = polar(end, r1)
    const c = polar(end, r2)
    const d = polar(start, r2)
    // Increasing longitude runs counterclockwise on screen, which is SVG sweep-flag 0.
    return `M ${a.x} ${a.y} A ${r1} ${r1} 0 0 0 ${b.x} ${b.y} L ${c.x} ${c.y} A ${r2} ${r2} 0 0 1 ${d.x} ${d.y} Z`
}

// Planets within a few degrees of each other would overlap, so step them inward.
function spreadRadii(planets: PlanetPosition[]) {
    const sorted = [...planets].sort((a, b) => a.longitude - b.longitude)
    const radii = new Map<string, number>()
    let prev: PlanetPosition | null = null
    let level = 0
    for (const p of sorted) {
        level = prev && p.longitude - prev.longitude < 7 ? (level + 1) % 3 : 0
        radii.set(p.body, R_PLANETS - level * 16)
        prev = p
    }
    return radii
}

function ChartWheel({ planets, className }: { planets: PlanetPosition[]; className?: string }) {
    const [active, setActive] = useState<string | null>(null)
    const radii = spreadRadii(planets)

    const aspects: { a: PlanetPosition; b: PlanetPosition; color: string }[] = []
    planets.forEach((a, i) =>
        planets.slice(i + 1).forEach((b) => {
            let diff = Math.abs(a.longitude - b.longitude) % 360
            if (diff > 180) diff = 360 - diff
            const match = ASPECTS.find((asp) => asp.angle > 0 && Math.abs(diff - asp.angle) <= asp.orb)
            if (match) aspects.push({ a, b, color: match.color })
        }),
    )

    const activePlanet = planets.find((p) => p.body === active)

    return (
        <div className={className}>
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img" aria-label="Birth chart wheel">
                <defs>
                    <radialGradient id="wheel-bg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#2a1f5c" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#0f0a1f" stopOpacity="0.9" />
                    </radialGradient>
                </defs>

                <circle cx={C} cy={C} r={R_OUTER} fill="url(#wheel-bg)" stroke="rgba(155,143,255,0.5)" />

                {/* Zodiac band */}
                {ZODIAC.map((sign, i) => {
                    const start = i * 30
                    const mid = polar(start + 15, (R_OUTER + R_SIGNS) / 2)
                    const tick = [polar(start, R_OUTER), polar(start, R_ASPECTS)]
                    return (
                        <g key={sign.name}>
                            <path d={segmentPath(start, start + 30, R_OUTER, R_SIGNS)} fill={ELEMENT_TINT[sign.element]} />
                            <line x1={tick[0].x} y1={tick[0].y} x2={tick[1].x} y2={tick[1].y} stroke="rgba(155,143,255,0.18)" />
                            <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="central" fontSize="18" fill="#e8e0ff" opacity="0.85">
                                {sign.symbol}
                            </text>
                        </g>
                    )
                })}

                <circle cx={C} cy={C} r={R_SIGNS} fill="none" stroke="rgba(155,143,255,0.45)" />
                <circle cx={C} cy={C} r={R_ASPECTS} fill="rgba(10,10,15,0.35)" stroke="rgba(155,143,255,0.3)" />

                {/* Aspect lines */}
                {aspects.map(({ a, b, color }) => {
                    const p1 = polar(a.longitude, R_ASPECTS)
                    const p2 = polar(b.longitude, R_ASPECTS)
                    const highlighted = active && (a.body === active || b.body === active)
                    return (
                        <line
                            key={`${a.body}-${b.body}`}
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke={color}
                            strokeWidth={highlighted ? 2 : 1}
                            opacity={active && !highlighted ? 0.25 : 1}
                        />
                    )
                })}

                {/* Planets */}
                {planets.map((p) => {
                    const r = radii.get(p.body) ?? R_PLANETS
                    const pos = polar(p.longitude, r)
                    const edge = polar(p.longitude, R_SIGNS)
                    const inner = polar(p.longitude, R_SIGNS - 6)
                    const isActive = active === p.body
                    return (
                        <g
                            key={p.body}
                            onMouseEnter={() => setActive(p.body)}
                            onMouseLeave={() => setActive(null)}
                            onClick={() => setActive(isActive ? null : p.body)}
                            className="cursor-pointer"
                        >
                            <line x1={edge.x} y1={edge.y} x2={inner.x} y2={inner.y} stroke="#9b8fff" strokeWidth="1.5" />
                            <circle cx={pos.x} cy={pos.y} r="13" fill={isActive ? "#534AB7" : "#1a1334"} stroke="#9b8fff" strokeOpacity={isActive ? 1 : 0.6} />
                            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize="15" fill="#e8e0ff">
                                {p.glyph}
                            </text>
                        </g>
                    )
                })}

                {/* Center readout */}
                <text x={C} y={C - 8} textAnchor="middle" fontSize="13" fill="#9b8fff" fontFamily="Cormorant Garamond Variable, serif" fontStyle="italic">
                    {activePlanet ? activePlanet.body : "Your sky"}
                </text>
                <text x={C} y={C + 12} textAnchor="middle" fontSize="15" fill="#e8e0ff" fontFamily="Cormorant Garamond Variable, serif">
                    {activePlanet ? `${activePlanet.degree}° ${activePlanet.sign.name}` : "at birth"}
                </text>
            </svg>
        </div>
    )
}

export default ChartWheel
