type MoonPhaseIconProps = {
    // 0° new, 90° first quarter, 180° full, 270° last quarter.
    angle: number
    size?: number
    className?: string
}

// Draws the lit part of the moon as the bright limb plus an elliptical terminator.
function MoonPhaseIcon({ angle, size = 64, className }: MoonPhaseIconProps) {
    const r = 45
    const c = 50
    const a = ((angle % 360) + 360) % 360
    const waxing = a < 180
    const rx = r * Math.abs(Math.cos((a * Math.PI) / 180))
    // Crescent phases bulge the terminator toward the lit side; gibbous phases away from it.
    const crescent = a < 90 || a > 270
    const limbSweep = waxing ? 1 : 0
    const terminatorSweep = waxing ? (crescent ? 0 : 1) : crescent ? 1 : 0
    const lit = `M ${c} ${c - r} A ${r} ${r} 0 0 ${limbSweep} ${c} ${c + r} A ${rx} ${r} 0 0 ${terminatorSweep} ${c} ${c - r} Z`

    return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-hidden="true">
            <defs>
                <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="70%" stopColor="#9b8fff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#9b8fff" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="moon-lit" cx="40%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#fbf8ff" />
                    <stop offset="100%" stopColor="#d4ccff" />
                </radialGradient>
            </defs>
            <circle cx={c} cy={c} r={50} fill="url(#moon-glow)" />
            <circle cx={c} cy={c} r={r} fill="#1a1334" stroke="rgba(155,143,255,0.35)" strokeWidth="1" />
            <path d={lit} fill="url(#moon-lit)" />
        </svg>
    )
}

export default MoonPhaseIcon
