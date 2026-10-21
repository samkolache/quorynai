import { clearOnboarding } from "./onboarding"
import { saveNotes } from "./journal"
import { clearSubscription } from "./subscription"
import { clearHistory } from "./history"
import { clearUsage } from "./limits"
import { clearPartner } from "./partner"
import { clearFriends } from "./friends"

const EMAIL_KEY = "quoryn-account-email"

// TODO: read the email from the signed-in session once a backend exists.
export function saveAccountEmail(email: string) {
    try {
        sessionStorage.setItem(EMAIL_KEY, email)
    } catch {
        // Storage can be unavailable (e.g. private mode); the flow still works for this visit.
    }
}

export function loadAccountEmail(): string {
    try {
        return sessionStorage.getItem(EMAIL_KEY) ?? ""
    } catch {
        return ""
    }
}

// Signing out forgets who is logged in; the browser keeps the journal.
export function signOut() {
    try {
        sessionStorage.removeItem(EMAIL_KEY)
    } catch {
        // Nothing to clear if storage is unavailable.
    }
}

// TODO: also delete the account (and cancel any paid plan) on the backend once one exists.
export function deleteAccount() {
    signOut()
    clearOnboarding()
    saveNotes([])
    clearSubscription()
    clearHistory()
    clearUsage()
    clearPartner()
    clearFriends()
}
