import { localDateKey } from "./daily"

export type JournalNote = { id: string; text: string; createdAt: string }

const STORAGE_KEY = "quoryn-manifestation-journal"

// TODO: store notes on the user's account once a backend exists. Until then they live in this browser.
export function loadNotes(): JournalNote[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as JournalNote[]) : []
    } catch {
        return []
    }
}

export function saveNotes(notes: JournalNote[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch {
        // Storage can be unavailable (e.g. private mode); notes still work for this visit.
    }
}

// Consecutive days with at least one entry, ending today (or yesterday, so the streak
// isn't shown as broken before the user has had a chance to write today).
export function getStreak(notes: JournalNote[], today = new Date()): number {
    const days = new Set(notes.map((n) => localDateKey(new Date(n.createdAt))))
    const cursor = new Date(today)
    if (!days.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
    let streak = 0
    while (days.has(localDateKey(cursor))) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
    }
    return streak
}
