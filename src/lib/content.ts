import type { Element } from "./astro"

// Written copy for the free reading, overview, and compatibility pages.
// These are fixed descriptions; personal readings come from the chat guide.

export const SUN_SIGN_TRAITS: Record<string, string> = {
    Aries: "You lead with courage and a spark that others follow. When something matters to you, you move first and ask questions later.",
    Taurus: "You are steady, sensual, and deeply loyal. You build slowly and beautifully, and what you build is made to last.",
    Gemini: "Your mind is quick and endlessly curious. You connect people and ideas, and you are at your best when life keeps you learning.",
    Cancer: "You feel everything deeply and protect the people you love fiercely. Home, wherever you make it, is your source of strength.",
    Leo: "You were born to shine and to help others shine with you. Your warmth is magnetic, and your heart is braver than most.",
    Virgo: "You notice what others miss and quietly make everything better. Your care shows up in the details.",
    Libra: "You seek harmony, beauty, and fairness in all things. People feel seen and balanced in your presence.",
    Scorpio: "You are intense, perceptive, and impossible to fool. You transform through every chapter and come back stronger.",
    Sagittarius: "You are a seeker of truth and freedom. Your optimism opens doors, and your stories make the world feel bigger.",
    Capricorn: "You are patient, ambitious, and wiser than your years. You climb steadily toward the life you have decided to build.",
    Aquarius: "You see the future before others do. Your originality and big heart make you a quiet revolutionary.",
    Pisces: "You are intuitive, dreamy, and endlessly compassionate. You feel the unseen currents that connect us all.",
}

export const MOON_ELEMENT_TRAITS: Record<Element, string> = {
    Fire: "Emotionally, you need passion and room to act. You process feelings by moving through them.",
    Earth: "Emotionally, you need stability and comfort. Routine and touch help you feel safe.",
    Air: "Emotionally, you need to talk things through. Understanding a feeling helps you release it.",
    Water: "Emotionally, you run deep. You absorb the moods around you and need quiet time to come back to yourself.",
}

export const LIFE_PATH_MEANINGS: Record<number, string> = {
    1: "The Leader: independent, driven, and here to forge your own way.",
    2: "The Peacemaker: intuitive, diplomatic, and gifted at bringing people together.",
    3: "The Creator: expressive, joyful, and meant to share your voice.",
    4: "The Builder: grounded, dedicated, and here to create lasting foundations.",
    5: "The Adventurer: free-spirited, adaptable, and hungry for experience.",
    6: "The Nurturer: devoted, responsible, and a healer for those you love.",
    7: "The Seeker: introspective, wise, and drawn to life's deeper mysteries.",
    8: "The Powerhouse: ambitious, capable, and destined for abundance.",
    9: "The Humanitarian: compassionate, idealistic, and here to give back.",
    11: "The Intuitive (master number): spiritually attuned and a light for others.",
    22: "The Master Builder (master number): visionary, with the power to make big dreams real.",
    33: "The Master Teacher (master number): selfless, loving, and here to uplift.",
}

export const ELEMENT_FOCUS: Record<Element, string[]> = {
    Fire: [
        "Your fire is asking for a bold first step today. Say yes before you overthink it.",
        "Channel your energy into one thing that excites you, and let the rest wait.",
        "Someone needs your spark today. A little encouragement from you goes a long way.",
        "Momentum is on your side. Start the thing you've been circling.",
    ],
    Earth: [
        "Slow, steady progress is your magic today. Tend to one small thing with care.",
        "Ground yourself before you decide. Your body already knows the answer.",
        "Invest in something that will matter a year from now.",
        "Comfort is not laziness. Rest is part of how you build.",
    ],
    Air: [
        "A conversation today could change your direction. Say what you've been thinking.",
        "Let your curiosity lead. The answer you need is in a question you haven't asked yet.",
        "Write it down. Your ideas are clearer on paper than in your head.",
        "Make space for lightness. Laughter will clear more than you expect.",
    ],
    Water: [
        "Trust the feeling that keeps coming back. Your intuition is speaking clearly.",
        "Protect your energy today. You are allowed to step back and recharge.",
        "A small act of tenderness, toward yourself or someone else, will ripple outward.",
        "Let something go. What you release today makes room for what you want.",
    ],
}

export const PHASE_GUIDANCE: Record<string, string> = {
    "New Moon": "Plant seeds",
    "Waxing Crescent": "Set intentions",
    "First Quarter": "Take action",
    "Waxing Gibbous": "Refine and trust",
    "Full Moon": "Celebrate and release",
    "Waning Gibbous": "Share gratitude",
    "Last Quarter": "Let go",
    "Waning Crescent": "Rest and reflect",
}

// How well two elements blend, from 0 to 100.
const ELEMENT_HARMONY: Record<Element, Record<Element, number>> = {
    Fire: { Fire: 82, Air: 92, Earth: 58, Water: 52 },
    Earth: { Earth: 84, Water: 92, Fire: 58, Air: 55 },
    Air: { Air: 80, Fire: 92, Earth: 55, Water: 57 },
    Water: { Water: 86, Earth: 92, Fire: 52, Air: 57 },
}

export function elementHarmony(a: Element, b: Element): number {
    return ELEMENT_HARMONY[a][b]
}

export const ELEMENT_PAIRING: Record<string, string> = {
    "Fire-Fire": "Two flames together: passionate, playful, and occasionally explosive.",
    "Fire-Air": "Air feeds fire. You inspire each other and rarely run out of things to do.",
    "Fire-Earth": "Fire brings excitement, earth brings staying power. Patience turns this into something solid.",
    "Fire-Water": "Steam and intensity. This pairing asks you both to slow down and listen.",
    "Earth-Earth": "Loyal and grounded. You build a life that feels safe and real.",
    "Earth-Water": "Water nourishes earth. A deeply caring, naturally supportive bond.",
    "Earth-Air": "Ideas meet practicality. Each of you shows the other a new way of seeing.",
    "Air-Air": "A meeting of minds. Endless conversation and shared curiosity.",
    "Air-Water": "Head and heart. Learning each other's language makes this bond beautiful.",
    "Water-Water": "Soul-deep understanding. You feel each other without needing words.",
}

export function pairingText(a: Element, b: Element): string {
    return ELEMENT_PAIRING[`${a}-${b}`] ?? ELEMENT_PAIRING[`${b}-${a}`]
}

// Short definitions for astrology terms, shown on hover or tap.
export const GLOSSARY = {
    sunSign: "Your sun sign is where the Sun was when you were born. It describes your core identity and how you shine.",
    moonSign: "Your moon sign is where the Moon was when you were born. It describes your emotional needs and inner world.",
    lifePath: "Your life path number comes from adding the digits of your birth date. It points to your purpose and natural gifts.",
    element: "Each sign belongs to an element: fire (passion), earth (stability), air (thought), or water (emotion).",
    moonPhase: "The Moon's phase sets the energy of the day: new moons are for beginnings, full moons for completion and release.",
    streak: "Write at least one intention each day to keep your streak going.",
} as const
