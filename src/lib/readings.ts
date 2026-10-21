import type { OnboardingInfo } from "./onboarding"
import { getLifePathNumber, getMoonSign, getSunSign } from "./astro"
import type { TarotCard } from "./tarot"

export type ReadingCategory = "astrology" | "tarot" | "manifestation" | "psychic" | "compatibility"

export type ChatMessage = { role: "user" | "guide"; text: string }

export type Partner = { name: string; dateOfBirth: string; timeOfBirth: string }

export type ReadingContext = {
    profile: OnboardingInfo | null
    drawnCards?: { position: string; card: TarotCard }[]
    partner?: Partner
}

// TODO: replace the body with a streaming call to the reading backend, e.g. fetch() a
// server endpoint and yield each chunk of text as it arrives. The chat panel shows each
// chunk as soon as it's yielded, and replies can use Markdown (bold, lists, headings).
export async function* streamReading(
    category: ReadingCategory,
    history: ChatMessage[],
    context: ReadingContext,
): AsyncGenerator<string> {
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500))
    const question = history[history.length - 1]?.text ?? ""
    const reply = placeholderReply(category, question, context)
    for (const word of reply.split(/(?<= )/)) {
        await new Promise((r) => setTimeout(r, 25 + Math.random() * 35))
        yield word
    }
}

function placeholderReply(category: ReadingCategory, question: string, { profile, drawnCards, partner }: ReadingContext) {
    const name = profile?.fullName.split(" ")[0]
    const greeting = name ? `${name}, ` : ""
    const asked = question ? `you asked: *"${question}"*\n\n` : ""

    switch (category) {
        case "astrology": {
            const sign = profile && getSunSign(profile.dateOfBirth)
            const lifePath = profile && getLifePathNumber(profile.dateOfBirth)
            const signLine = sign
                ? `As a **${sign.name} sun**, your ${sign.element.toLowerCase()} nature shapes how you move through this.`
                : "Once your birth details are on file, I can read your full chart."
            const numberLine = lifePath ? ` Your **life path number ${lifePath}** points toward a season of growth.` : ""
            return `${greeting}${asked}${signLine}${numberLine} Trust the timing that is unfolding for you.`
        }
        case "tarot": {
            if (!drawnCards?.length) return "Draw your cards first, then ask your question and I'll read the spread for you."
            const lines = drawnCards.map(({ position, card }) => `- **${position}: ${card.name}**, speaking of ${card.meaning}.`)
            return `${greeting}${asked}Here is what your spread reveals:\n\n${lines.join("\n")}\n\nTogether, these cards ask you to honor where you've been while stepping forward with intention.`
        }
        case "manifestation":
            return `${greeting}${asked}Write your intention in the **present tense**, as if it's already yours. Feel the gratitude of having it now. Small, aligned actions each day will carry it from the page into your life.`
        case "psychic":
            return `${greeting}${asked}I sense a shift in your energy. Something you've been holding is ready to be released, and clarity is closer than it feels. Pay attention to the signs that repeat this week.`
        case "compatibility": {
            if (!partner) return "Add the other person's birth details first, and I'll read your connection."
            const yours = profile && getSunSign(profile.dateOfBirth)
            const theirs = getSunSign(partner.dateOfBirth)
            const theirMoon = getMoonSign(partner)
            const pair = yours && theirs ? `Your **${yours.name}** sun meets ${partner.name}'s **${theirs.name}** sun` : `You and ${partner.name} share a meaningful connection`
            const moon = theirMoon ? `, and their **${theirMoon.name} moon** shapes how they feel close to you` : ""
            return `${greeting}${asked}${pair}${moon}. This bond grows strongest when you both make room for each other's rhythm.`
        }
    }
}
