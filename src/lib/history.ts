import type { ChatMessage, ReadingCategory } from "./readings"

export type ReadingSession = {
    id: string
    category: ReadingCategory
    // First question, used as the title in the history list.
    title: string
    updatedAt: string
    messages: ChatMessage[]
    // Short summary of what the reading was based on, e.g. the cards drawn.
    detail?: string
}

const STORAGE_KEY = "quoryn-reading-history"
const MAX_SESSIONS = 50

// TODO: store reading history on the user's account once a backend exists.
export function loadHistory(category?: ReadingCategory): ReadingSession[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const all = raw ? (JSON.parse(raw) as ReadingSession[]) : []
        return category ? all.filter((s) => s.category === category) : all
    } catch {
        return []
    }
}

export function saveSession(session: ReadingSession) {
    try {
        const rest = loadHistory().filter((s) => s.id !== session.id)
        const next = [session, ...rest].slice(0, MAX_SESSIONS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
        // Storage can be unavailable; the reading still shows for this visit.
    }
}

export function clearHistory() {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        // Nothing to clear if storage is unavailable.
    }
}
