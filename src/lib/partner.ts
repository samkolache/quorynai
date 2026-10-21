import type { Partner } from "./readings"

const STORAGE_KEY = "quoryn-compatibility-partner"

// Remembers the last person the user compared charts with.
export function loadPartner(): Partner | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as Partner) : null
    } catch {
        return null
    }
}

export function savePartner(partner: Partner) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(partner))
    } catch {
        // Storage can be unavailable; the comparison still shows for this visit.
    }
}

export function clearPartner() {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        // Nothing to clear if storage is unavailable.
    }
}
