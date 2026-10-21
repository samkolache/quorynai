import type { PlanetPosition } from "@/lib/astro"

// Text companion to the chart wheel, listing where each planet sits.
function PlanetList({ planets }: { planets: PlanetPosition[] }) {
    return (
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {planets.map((p) => (
                <li key={p.body} className="flex items-center gap-3 text-sm">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-secondary text-accent">{p.glyph}</span>
                    <span className="flex flex-col leading-tight">
                        <span className="text-foreground/60">{p.body}</span>
                        <span className="font-heading text-base">
                            {p.degree}° {p.sign.name}
                        </span>
                    </span>
                </li>
            ))}
        </ul>
    )
}

export default PlanetList
