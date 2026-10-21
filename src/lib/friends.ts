import { loadAccountEmail } from "./account"
import { loadOnboarding } from "./onboarding"

export type FriendProfile = {
    id: string
    name: string
    handle: string
    // Shared with friends so compatibility can be calculated from their real chart.
    dateOfBirth: string
    timeOfBirth: string
}

export type FriendRequest = {
    id: string
    user: FriendProfile
    direction: "incoming" | "outgoing"
    sentAt: string
}

export type SearchResult = FriendProfile & { status: "friend" | "pending" | "none" }

// TODO: every function below should call the backend once accounts exist. Until then, friends
// and requests are kept in this browser, and DEMO_MODE fills search with sample profiles so the
// whole flow can be tried. Delete DEMO_DIRECTORY and set DEMO_MODE to false when the API is live.
const DEMO_MODE = true

const DEMO_DIRECTORY: FriendProfile[] = [
    { id: "demo-ava", name: "Ava Moreno", handle: "avamoon", dateOfBirth: "2002-08-03", timeOfBirth: "07:15" },
    { id: "demo-jordan", name: "Jordan Lee", handle: "jordanstars", dateOfBirth: "2001-11-19", timeOfBirth: "22:40" },
    { id: "demo-priya", name: "Priya Shah", handle: "priya.s", dateOfBirth: "2003-02-27", timeOfBirth: "13:05" },
    { id: "demo-sam", name: "Sam Rivera", handle: "samr", dateOfBirth: "2000-06-12", timeOfBirth: "" },
    { id: "demo-noor", name: "Noor Haddad", handle: "noorlight", dateOfBirth: "2002-04-08", timeOfBirth: "05:50" },
    { id: "demo-leo", name: "Leo Park", handle: "leo.park", dateOfBirth: "2001-07-30", timeOfBirth: "18:20" },
]

const STORAGE_KEY = "quoryn-friends"

type FriendsState = { friends: FriendProfile[]; requests: FriendRequest[]; seeded?: boolean }

function load(): FriendsState {
    let state: FriendsState = { friends: [], requests: [] }
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) state = JSON.parse(raw) as FriendsState
    } catch {
        // Start empty.
    }
    // In demo mode, one incoming request shows what accepting a friend looks like.
    if (DEMO_MODE && !state.seeded) {
        state = {
            ...state,
            seeded: true,
            requests: [...state.requests, { id: "req-demo-ava", user: DEMO_DIRECTORY[0], direction: "incoming", sentAt: new Date().toISOString() }],
        }
        save(state)
    }
    return state
}

function save(state: FriendsState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
        // Storage can be unavailable; changes last for this visit only.
    }
}

// Simulates network latency so loading states are exercised before the real API exists.
const latency = () => new Promise((r) => setTimeout(r, 300 + Math.random() * 300))

export function getMyHandle(): string {
    const email = loadAccountEmail()
    if (email) return email.split("@")[0].toLowerCase()
    const name = loadOnboarding()?.fullName
    return name ? name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") : "you"
}

export function getInviteLink(): string {
    return `${window.location.origin}/onboarding?invite=${encodeURIComponent(getMyHandle())}`
}

export async function listFriends(): Promise<FriendProfile[]> {
    await latency()
    return load().friends
}

export async function listRequests(): Promise<FriendRequest[]> {
    await latency()
    return load().requests
}

export async function searchUsers(query: string): Promise<SearchResult[]> {
    await latency()
    const q = query.trim().toLowerCase().replace(/^@/, "")
    if (q.length < 2 || !DEMO_MODE) return []
    const { friends, requests } = load()
    return DEMO_DIRECTORY.filter((u) => u.name.toLowerCase().includes(q) || u.handle.includes(q)).map((u) => ({
        ...u,
        status: friends.some((f) => f.id === u.id) ? "friend" : requests.some((r) => r.user.id === u.id) ? "pending" : "none",
    }))
}

export async function sendFriendRequest(user: FriendProfile): Promise<void> {
    await latency()
    const state = load()
    if (state.requests.some((r) => r.user.id === user.id)) return
    save({ ...state, requests: [...state.requests, { id: `req-${user.id}`, user, direction: "outgoing", sentAt: new Date().toISOString() }] })
}

export async function acceptRequest(requestId: string): Promise<FriendProfile | null> {
    await latency()
    const state = load()
    const request = state.requests.find((r) => r.id === requestId)
    if (!request) return null
    save({ ...state, friends: [...state.friends, request.user], requests: state.requests.filter((r) => r.id !== requestId) })
    return request.user
}

// Declining an incoming request and cancelling an outgoing one both just remove it.
export async function removeRequest(requestId: string): Promise<void> {
    await latency()
    const state = load()
    save({ ...state, requests: state.requests.filter((r) => r.id !== requestId) })
}

export async function removeFriend(friendId: string): Promise<void> {
    await latency()
    const state = load()
    save({ ...state, friends: state.friends.filter((f) => f.id !== friendId) })
}

export function clearFriends() {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        // Nothing to clear if storage is unavailable.
    }
}

const INVITE_KEY = "quoryn-invited-by"

// Remembers who invited a new user so the backend can connect them after sign-up.
export function saveInvitedBy(handle: string) {
    try {
        sessionStorage.setItem(INVITE_KEY, handle)
    } catch {
        // Invite just won't carry through.
    }
}

export function loadInvitedBy(): string | null {
    try {
        return sessionStorage.getItem(INVITE_KEY)
    } catch {
        return null
    }
}
