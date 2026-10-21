import { Body, Ecliptic, GeoVector, MoonPhase } from "astronomy-engine"
import type { OnboardingInfo } from "./onboarding"

// U+FE0E asks the browser to draw these as text glyphs rather than colored emoji.
const TEXT = "︎"

export type Element = "Fire" | "Earth" | "Air" | "Water"

export type SunSign = { name: string; symbol: string; element: Element }

// In zodiac order, starting at 0° Aries.
export const ZODIAC: SunSign[] = [
    { name: "Aries", symbol: "♈" + TEXT, element: "Fire" },
    { name: "Taurus", symbol: "♉" + TEXT, element: "Earth" },
    { name: "Gemini", symbol: "♊" + TEXT, element: "Air" },
    { name: "Cancer", symbol: "♋" + TEXT, element: "Water" },
    { name: "Leo", symbol: "♌" + TEXT, element: "Fire" },
    { name: "Virgo", symbol: "♍" + TEXT, element: "Earth" },
    { name: "Libra", symbol: "♎" + TEXT, element: "Air" },
    { name: "Scorpio", symbol: "♏" + TEXT, element: "Water" },
    { name: "Sagittarius", symbol: "♐" + TEXT, element: "Fire" },
    { name: "Capricorn", symbol: "♑" + TEXT, element: "Earth" },
    { name: "Aquarius", symbol: "♒" + TEXT, element: "Air" },
    { name: "Pisces", symbol: "♓" + TEXT, element: "Water" },
]

// Month/day each sign begins, aligned with ZODIAC.
const SIGN_STARTS = [[3, 21], [4, 20], [5, 21], [6, 21], [7, 23], [8, 23], [9, 23], [10, 23], [11, 22], [12, 22], [1, 20], [2, 19]]

// dateOfBirth is the "YYYY-MM-DD" value from the onboarding date input.
// Uses calendar dates so the sign is right even when the birth time is unknown.
export function getSunSign(dateOfBirth: string): SunSign | null {
    const [, month, day] = dateOfBirth.split("-").map(Number)
    if (!month || !day) return null
    const md = month * 100 + day
    let best = 9 // Capricorn covers the wrap from late December into January.
    let bestStart = -1
    SIGN_STARTS.forEach(([m, d], i) => {
        const start = m * 100 + d
        if (start <= md && start > bestStart) {
            best = i
            bestStart = start
        }
    })
    return ZODIAC[best]
}

export function signFromLongitude(longitude: number): SunSign {
    return ZODIAC[Math.floor((((longitude % 360) + 360) % 360) / 30)]
}

// Sum every digit of the birth date, reducing until one digit or a master number (11, 22, 33) remains.
export function getLifePathNumber(dateOfBirth: string): number | null {
    const digits = dateOfBirth.replace(/\D/g, "")
    if (digits.length !== 8) return null
    let n = [...digits].reduce((sum, d) => sum + Number(d), 0)
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
        n = [...String(n)].reduce((sum, d) => sum + Number(d), 0)
    }
    return n
}

// TODO: the birth time is read in the browser's time zone. Converting it from the birthplace's
// time zone needs a geocoding lookup on the backend; that also unlocks the rising sign and houses.
export function getBirthMoment(profile: Pick<OnboardingInfo, "dateOfBirth" | "timeOfBirth">): Date | null {
    const [y, m, d] = profile.dateOfBirth.split("-").map(Number)
    if (!y || !m || !d) return null
    // Noon is the conventional stand-in when the birth time is unknown.
    const [h, min] = profile.timeOfBirth ? profile.timeOfBirth.split(":").map(Number) : [12, 0]
    return new Date(y, m - 1, d, h, min)
}

export type PlanetPosition = { body: string; glyph: string; longitude: number; sign: SunSign; degree: number }

const PLANETS: { body: Body; glyph: string }[] = [
    { body: Body.Sun, glyph: "☉" },
    { body: Body.Moon, glyph: "☽" },
    { body: Body.Mercury, glyph: "☿" },
    { body: Body.Venus, glyph: "♀" },
    { body: Body.Mars, glyph: "♂" },
    { body: Body.Jupiter, glyph: "♃" },
    { body: Body.Saturn, glyph: "♄" },
    { body: Body.Uranus, glyph: "♅" },
    { body: Body.Neptune, glyph: "♆" },
    { body: Body.Pluto, glyph: "♇" },
]

// Geocentric ecliptic longitude of each planet at the given moment.
export function getPlanetPositions(date: Date): PlanetPosition[] {
    return PLANETS.map(({ body, glyph }) => {
        const longitude = Ecliptic(GeoVector(body, date, true)).elon
        return { body, glyph: glyph + TEXT, longitude, sign: signFromLongitude(longitude), degree: Math.floor(longitude % 30) }
    })
}

export function getMoonSign(profile: Pick<OnboardingInfo, "dateOfBirth" | "timeOfBirth">): SunSign | null {
    const moment = getBirthMoment(profile)
    if (!moment) return null
    return signFromLongitude(Ecliptic(GeoVector(Body.Moon, moment, true)).elon)
}

export function getMoonSignOn(date = new Date()): SunSign {
    return signFromLongitude(Ecliptic(GeoVector(Body.Moon, date, true)).elon)
}

// 0° is new moon, 90° first quarter, 180° full, 270° last quarter.
export function getMoonPhaseAngle(date = new Date()): number {
    return MoonPhase(date)
}

const PHASES = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
]

export function getMoonPhase(date = new Date()): string {
    return PHASES[Math.floor(getMoonPhaseAngle(date) / 45 + 0.5) % 8]
}
