export type OnboardingInfo = {
    fullName: string
    dateOfBirth: string
    timeOfBirth: string
    placeOfBirth: string
    gender: string
}

export const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Other", "Prefer not to say"]

const STORAGE_KEY = "quoryn-onboarding"

// Kept in sessionStorage so the info survives a refresh between onboarding and account creation.
export function saveOnboarding(info: OnboardingInfo) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(info))
    } catch {
        // Storage can be unavailable (e.g. private mode); the flow still works for this visit.
    }
}

export function loadOnboarding(): OnboardingInfo | null {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as OnboardingInfo) : null
    } catch {
        return null
    }
}

export function clearOnboarding() {
    try {
        sessionStorage.removeItem(STORAGE_KEY)
    } catch {
        // Nothing to clear if storage is unavailable.
    }
}
