export type Billing = "monthly" | "annual"

export type Subscription = {
    plan: string
    billing: Billing
    // ISO date the current plan started; used to show the next renewal date.
    startedAt: string
}

const STORAGE_KEY = "quoryn-subscription"

export const FREE_PLAN = "Seeker"

// TODO: load and change the subscription through the payment provider once billing is set up.
// Until then the chosen plan is only remembered in this browser.
export function loadSubscription(): Subscription {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw) as Subscription
    } catch {
        // Fall through to the free plan.
    }
    return { plan: FREE_PLAN, billing: "monthly", startedAt: new Date().toISOString() }
}

export function saveSubscription(sub: Subscription) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sub))
    } catch {
        // Storage can be unavailable (e.g. private mode); the change still shows for this visit.
    }
}

export function clearSubscription() {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        // Nothing to clear if storage is unavailable.
    }
}

// The next billing date after today, counting whole months or years from when the plan started.
export function nextRenewal({ billing, startedAt }: Subscription, today = new Date()): Date {
    const next = new Date(startedAt)
    while (next <= today) {
        if (billing === "annual") next.setFullYear(next.getFullYear() + 1)
        else next.setMonth(next.getMonth() + 1)
    }
    return next
}
