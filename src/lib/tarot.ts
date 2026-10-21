export type TarotCard = { name: string; numeral: string; meaning: string; image: string }

// Artwork is the public domain 1909 Rider-Waite deck by Pamela Colman Smith, stored in public/tarot.
const CARDS: Omit<TarotCard, "image">[] = [
    { name: "The Fool", numeral: "0", meaning: "new beginnings, trust, and a leap of faith" },
    { name: "The Magician", numeral: "I", meaning: "willpower, skill, and turning ideas into reality" },
    { name: "The High Priestess", numeral: "II", meaning: "intuition, mystery, and inner knowing" },
    { name: "The Empress", numeral: "III", meaning: "abundance, nurturing, and creativity" },
    { name: "The Emperor", numeral: "IV", meaning: "structure, stability, and leadership" },
    { name: "The Hierophant", numeral: "V", meaning: "tradition, guidance, and shared wisdom" },
    { name: "The Lovers", numeral: "VI", meaning: "connection, harmony, and meaningful choices" },
    { name: "The Chariot", numeral: "VII", meaning: "determination, momentum, and victory" },
    { name: "Strength", numeral: "VIII", meaning: "courage, patience, and quiet resilience" },
    { name: "The Hermit", numeral: "IX", meaning: "reflection, solitude, and inner guidance" },
    { name: "Wheel of Fortune", numeral: "X", meaning: "cycles, change, and turning points" },
    { name: "Justice", numeral: "XI", meaning: "truth, fairness, and cause and effect" },
    { name: "The Hanged Man", numeral: "XII", meaning: "surrender, pause, and a new perspective" },
    { name: "Death", numeral: "XIII", meaning: "endings, transformation, and renewal" },
    { name: "Temperance", numeral: "XIV", meaning: "balance, moderation, and healing" },
    { name: "The Devil", numeral: "XV", meaning: "attachment, temptation, and breaking free" },
    { name: "The Tower", numeral: "XVI", meaning: "sudden change, revelation, and release" },
    { name: "The Star", numeral: "XVII", meaning: "hope, renewal, and inspiration" },
    { name: "The Moon", numeral: "XVIII", meaning: "dreams, illusion, and the subconscious" },
    { name: "The Sun", numeral: "XIX", meaning: "joy, success, and vitality" },
    { name: "Judgement", numeral: "XX", meaning: "awakening, reckoning, and a calling" },
    { name: "The World", numeral: "XXI", meaning: "completion, wholeness, and fulfillment" },
]

export const MAJOR_ARCANA: TarotCard[] = CARDS.map((card, i) => ({ ...card, image: `/tarot/${String(i).padStart(2, "0")}.jpg` }))

export const SPREAD_POSITIONS = ["Past", "Present", "Future"] as const

// Fisher-Yates shuffle that returns a new array.
export function shuffle<T>(items: T[]): T[] {
    const out = [...items]
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}
