import { useCallback, useEffect, useState } from "react"
import { Check, Heart, Loader2, UserMinus, UserPlus, Users, X } from "lucide-react"
import { toast } from "sonner"
import FindFriendsDialog from "@/components/friends/FindFriendsDialog"
import FriendAvatar from "@/components/friends/FriendAvatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getSunSign } from "@/lib/astro"
import { getCompatibility } from "@/lib/compatibility"
import { acceptRequest, listFriends, listRequests, removeFriend, removeRequest, type FriendProfile, type FriendRequest } from "@/lib/friends"
import type { OnboardingInfo } from "@/lib/onboarding"

type FriendsPanelProps = {
    profile: OnboardingInfo
    onCompare: (friend: FriendProfile) => void
}

function FriendsPanel({ profile, onCompare }: FriendsPanelProps) {
    const [friends, setFriends] = useState<FriendProfile[] | null>(null)
    const [requests, setRequests] = useState<FriendRequest[]>([])
    const [findOpen, setFindOpen] = useState(false)
    const [busy, setBusy] = useState<string | null>(null)

    const refresh = useCallback(async () => {
        const [f, r] = await Promise.all([listFriends(), listRequests()])
        setFriends(f)
        setRequests(r)
    }, [])

    useEffect(() => {
        // Loading from the friends store (later the API) is the external sync this effect is for.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refresh()
    }, [refresh])

    async function accept(request: FriendRequest) {
        setBusy(request.id)
        await acceptRequest(request.id)
        await refresh()
        setBusy(null)
        toast.success(`You and ${request.user.name.split(" ")[0]} are now connected.`)
    }

    async function dismiss(request: FriendRequest) {
        setBusy(request.id)
        await removeRequest(request.id)
        await refresh()
        setBusy(null)
    }

    async function unfriend(friend: FriendProfile) {
        setBusy(friend.id)
        await removeFriend(friend.id)
        await refresh()
        setBusy(null)
        toast(`Removed ${friend.name.split(" ")[0]} from your friends.`)
    }

    const incoming = requests.filter((r) => r.direction === "incoming")
    const outgoing = requests.filter((r) => r.direction === "outgoing")

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-normal">Your friends on Quoryn</h2>
                    <span className="text-sm text-foreground/55">Compare using their real charts. No typing birth dates.</span>
                </div>
                <Button size="md" onClick={() => setFindOpen(true)}>
                    <UserPlus className="size-4" /> Find friends
                </Button>
            </div>

            {incoming.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-accent">Friend requests</span>
                    {incoming.map((r) => (
                        <div key={r.id} className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-3">
                            <FriendAvatar name={r.user.name} dateOfBirth={r.user.dateOfBirth} />
                            <div className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate text-sm">
                                    <strong className="font-semibold">{r.user.name}</strong> wants to compare charts
                                </span>
                                <span className="truncate text-xs text-foreground/50">@{r.user.handle}</span>
                            </div>
                            <Button size="sm" onClick={() => accept(r)} disabled={busy === r.id} className="px-3">
                                {busy === r.id ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Accept
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => dismiss(r)} disabled={busy === r.id} aria-label={`Decline ${r.user.name}`}>
                                <X className="size-3.5" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {friends === null ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {[0, 1].map((i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl bg-primary/15" />
                    ))}
                </div>
            ) : friends.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-secondary/30 px-6 py-10 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
                        <Users className="size-6 text-accent" />
                    </span>
                    <div className="flex flex-col gap-1">
                        <span className="font-heading text-2xl">Your circle is waiting</span>
                        <p className="max-w-sm">Find friends already on Quoryn, or send your invite link to bring someone new.</p>
                    </div>
                    <Button size="md" onClick={() => setFindOpen(true)}>
                        <UserPlus className="size-4" /> Find friends
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {friends.map((f) => {
                        const score = getCompatibility(profile, f)?.overall
                        const sign = getSunSign(f.dateOfBirth)
                        return (
                            <div key={f.id} className="group flex flex-col gap-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80 p-5 transition-colors hover:border-primary">
                                <div className="flex items-center gap-3">
                                    <FriendAvatar name={f.name} dateOfBirth={f.dateOfBirth} size="lg" />
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="truncate font-heading text-xl">{f.name}</span>
                                        <span className="truncate text-xs text-foreground/50">
                                            @{f.handle}
                                            {sign && ` · ${sign.name}`}
                                        </span>
                                    </div>
                                    {score !== undefined && (
                                        <span className="flex flex-col items-end">
                                            <span className="font-heading text-2xl text-accent">{score}%</span>
                                            <span className="text-[0.65rem] uppercase tracking-wider text-foreground/45">Harmony</span>
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" onClick={() => onCompare(f)} className="flex-1">
                                        <Heart className="size-3.5" /> See our compatibility
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" onClick={() => unfriend(f)} disabled={busy === f.id} aria-label={`Remove ${f.name}`} className="text-foreground/40 hover:text-destructive">
                                        <UserMinus className="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {outgoing.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-foreground/45">Sent requests</span>
                    <div className="flex flex-wrap gap-2">
                        {outgoing.map((r) => (
                            <span key={r.id} className="flex items-center gap-2 rounded-full border border-primary/25 bg-secondary/40 py-1 pr-1 pl-3 text-sm text-foreground/75">
                                {r.user.name} · Pending
                                <button
                                    type="button"
                                    onClick={() => dismiss(r)}
                                    aria-label={`Cancel request to ${r.user.name}`}
                                    className="rounded-full p-1 text-foreground/40 hover:bg-primary/20 hover:text-foreground"
                                >
                                    <X className="size-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <FindFriendsDialog open={findOpen} onOpenChange={setFindOpen} onRequestSent={refresh} />
        </div>
    )
}

export default FriendsPanel
