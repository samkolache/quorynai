import { getMoonPhase, getMoonPhaseAngle, getMoonSignOn, type SunSign } from "./astro"
import { ELEMENT_FOCUS, PHASE_GUIDANCE } from "./content"
import { MAJOR_ARCANA, type TarotCard } from "./tarot"

// Small deterministic hash so the same person sees the same card and message all day.
function hash(text: string): number {
    let h = 2166136261
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

export function localDateKey(date = new Date()): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

export function getDailyCard(seed: string, date = new Date()): TarotCard {
    return MAJOR_ARCANA[hash(`card:${seed}:${localDateKey(date)}`) % MAJOR_ARCANA.length]
}

export function getDailyMessage(sign: SunSign | null, seed: string, date = new Date()): string {
    const pool = sign ? ELEMENT_FOCUS[sign.element] : Object.values(ELEMENT_FOCUS).flat()
    return pool[hash(`msg:${seed}:${localDateKey(date)}`) % pool.length]
}

export type DayEnergy = { moonSign: SunSign; phase: string; phaseAngle: number; guidance: string }

export function getDayEnergy(date = new Date()): DayEnergy {
    const phase = getMoonPhase(date)
    return { moonSign: getMoonSignOn(date), phase, phaseAngle: getMoonPhaseAngle(date), guidance: PHASE_GUIDANCE[phase] }
}
