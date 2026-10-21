import { FREE_PLAN, loadSubscription } from "./subscription"

// Free-plan allowances from the pricing page. Paid plans have no limit on these.
// TODO: enforce these on the backend too; browser storage is easy to clear.
export const FREE_LIMITS = {
    tarot: { perWeek: 1, label: "tarot spread" },
    psychic: { perWeek: 3, label: "psychic question" },
} as const

export type LimitedFeature = keyof typeof FREE_LIMITS

const STORAGE_KEY = "quoryn-usage"
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

type Usage = Partial<Record<LimitedFeature, string[]>>

function load(): Usage {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as Usage) : {}
    } catch {
        return {}
    }
}

function usesThisWeek(feature: LimitedFeature): string[] {
    const cutoff = Date.now() - WEEK_MS
    return (load()[feature] ?? []).filter((iso) => new Date(iso).getTime() > cutoff)
}

export function isFreePlan(): boolean {
    return loadSubscription().plan === FREE_PLAN
}

export function remainingUses(feature: LimitedFeature): number {
    if (!isFreePlan()) return Infinity
    return Math.max(0, FREE_LIMITS[feature].perWeek - usesThisWeek(feature).length)
}

export function recordUse(feature: LimitedFeature) {
    if (!isFreePlan()) return
    try {
        const usage = load()
        usage[feature] = [...usesThisWeek(feature), new Date().toISOString()]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usage))
    } catch {
        // Storage can be unavailable; the limit just won't carry over.
    }
}

// When the oldest use this week expires and a new one frees up.
export function nextResetDate(feature: LimitedFeature): Date | null {
    const uses = usesThisWeek(feature)
    if (uses.length === 0) return null
    const oldest = Math.min(...uses.map((iso) => new Date(iso).getTime()))
    return new Date(oldest + WEEK_MS)
}

export function clearUsage() {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        // Nothing to clear if storage is unavailable.
    }
}
