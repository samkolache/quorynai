const STORAGE_KEY = "quoryn-sounds"

// Sounds are off unless the user turns them on.
export function soundsEnabled(): boolean {
    try {
        return localStorage.getItem(STORAGE_KEY) === "on"
    } catch {
        return false
    }
}

export function setSoundsEnabled(on: boolean) {
    try {
        localStorage.setItem(STORAGE_KEY, on ? "on" : "off")
    } catch {
        // Preference just won't persist.
    }
}

let ctx: AudioContext | null = null

// A soft two-note bell, synthesized so no audio files need to ship.
export function playChime() {
    if (!soundsEnabled()) return
    try {
        ctx ??= new AudioContext()
        const now = ctx.currentTime
        ;[880, 1318.5].forEach((freq, i) => {
            const osc = ctx!.createOscillator()
            const gain = ctx!.createGain()
            osc.type = "sine"
            osc.frequency.value = freq
            const start = now + i * 0.08
            gain.gain.setValueAtTime(0, start)
            gain.gain.linearRampToValueAtTime(0.08, start + 0.02)
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.4)
            osc.connect(gain).connect(ctx!.destination)
            osc.start(start)
            osc.stop(start + 1.5)
        })
    } catch {
        // Audio can be blocked; the chime is purely decorative.
    }
}
