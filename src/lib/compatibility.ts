import { getLifePathNumber, getMoonSign, getSunSign, type SunSign } from "./astro"
import { elementHarmony, pairingText } from "./content"
import type { OnboardingInfo } from "./onboarding"
import type { Partner } from "./readings"

export type Compatibility = {
    you: { sun: SunSign; moon: SunSign | null; lifePath: number | null }
    them: { sun: SunSign; moon: SunSign | null; lifePath: number | null }
    core: number
    emotional: number
    path: number
    overall: number
    summary: string
}

// Life path numbers fall into three broad temperaments: independent, grounded, and expressive.
const PATH_GROUPS = [[1, 5, 7], [2, 4, 8], [3, 6, 9]]

function reduceMaster(n: number) {
    return n > 9 ? [...String(n)].reduce((s, d) => s + Number(d), 0) : n
}

function pathHarmony(a: number | null, b: number | null): number {
    if (!a || !b) return 70
    const x = reduceMaster(a)
    const y = reduceMaster(b)
    if (x === y) return 84
    return PATH_GROUPS.some((g) => g.includes(x) && g.includes(y)) ? 90 : 68
}

// A simple element-based score. Personal, nuanced compatibility readings come from the chat guide.
export function getCompatibility(profile: OnboardingInfo, partner: Partner): Compatibility | null {
    const yourSun = getSunSign(profile.dateOfBirth)
    const theirSun = getSunSign(partner.dateOfBirth)
    if (!yourSun || !theirSun) return null

    const you = { sun: yourSun, moon: getMoonSign(profile), lifePath: getLifePathNumber(profile.dateOfBirth) }
    const them = { sun: theirSun, moon: getMoonSign(partner), lifePath: getLifePathNumber(partner.dateOfBirth) }

    const core = elementHarmony(you.sun.element, them.sun.element)
    const emotional = you.moon && them.moon ? elementHarmony(you.moon.element, them.moon.element) : core
    const path = pathHarmony(you.lifePath, them.lifePath)
    const overall = Math.round(core * 0.45 + emotional * 0.35 + path * 0.2)

    return { you, them, core, emotional, path, overall, summary: pairingText(you.sun.element, them.sun.element) }
}
