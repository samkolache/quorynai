import { useEffect, useState } from "react"
import { Check, Copy, Link2, Loader2, Search, Share2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getSunSign } from "@/lib/astro"
import { getInviteLink, getMyHandle, searchUsers, sendFriendRequest, type SearchResult } from "@/lib/friends"
import { canShareText, copyText, shareText } from "@/lib/share"
import FriendAvatar from "./FriendAvatar"

type FindFriendsDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    // Lets the page refresh its pending requests after one is sent.
    onRequestSent: () => void
}

function FindFriendsDialog({ open, onOpenChange, onRequestSent }: FindFriendsDialogProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [searching, setSearching] = useState(false)
    const [sending, setSending] = useState<string | null>(null)
    const inviteLink = getInviteLink()

    const searchable = query.trim().length >= 2

    function handleQueryChange(value: string) {
        setQuery(value)
        setSearching(value.trim().length >= 2)
    }

    // Search as the user types, waiting for a short pause between keystrokes.
    useEffect(() => {
        if (!searchable) return
        let cancelled = false
        const t = setTimeout(async () => {
            const found = await searchUsers(query)
            if (!cancelled) {
                setResults(found)
                setSearching(false)
            }
        }, 250)
        return () => {
            cancelled = true
            clearTimeout(t)
        }
    }, [query, searchable])

    async function add(user: SearchResult) {
        setSending(user.id)
        await sendFriendRequest(user)
        setResults((r) => r.map((x) => (x.id === user.id ? { ...x, status: "pending" } : x)))
        setSending(null)
        onRequestSent()
        toast.success(`Friend request sent to ${user.name.split(" ")[0]}.`)
    }

    async function shareInvite() {
        const message = `Let's compare our charts on Quoryn ✨ ${inviteLink}`
        try {
            if (canShareText()) await shareText("Join me on Quoryn", message)
            else {
                await copyText(inviteLink)
                toast.success("Invite link copied.")
            }
        } catch {
            toast.error("Couldn't share the link. Try copying it instead.")
        }
    }

    async function copyInvite() {
        try {
            await copyText(inviteLink)
            toast.success("Invite link copied.")
        } catch {
            toast.error("Couldn't copy the link.")
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                onOpenChange(next)
                if (!next) handleQueryChange("")
            }}
        >
            <DialogContent className="max-h-[85vh] gap-6 overflow-y-auto border border-primary/40 bg-gradient-to-br from-[#1a1334] to-[#0f0a1f] p-6 sm:max-w-lg">
                <div className="flex flex-col gap-1.5">
                    <DialogTitle className="text-3xl font-light">Find friends</DialogTitle>
                    <DialogDescription className="text-foreground/65">
                        Connect with friends on Quoryn to compare charts. Friends can see each other's birth date and sun sign.
                    </DialogDescription>
                </div>

                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-foreground/40" />
                    <Input autoFocus value={query} onChange={(e) => handleQueryChange(e.target.value)} placeholder="Search by name or @username" aria-label="Search for friends" className="pl-10" />
                    {searching && <Loader2 className="absolute top-1/2 right-3.5 size-4 -translate-y-1/2 animate-spin text-accent" />}
                </div>

                {searchable && !searching && (
                    <ul className="flex flex-col gap-2">
                        {results.length === 0 ? (
                            <li className="rounded-xl border border-dashed border-primary/30 p-4 text-center text-sm text-foreground/60">
                                No one found. Invite them with your link below.
                            </li>
                        ) : (
                            results.map((u) => {
                                const sign = getSunSign(u.dateOfBirth)
                                return (
                                    <li key={u.id} className="flex items-center gap-3 rounded-xl border border-primary/20 bg-secondary/40 p-3">
                                        <FriendAvatar name={u.name} dateOfBirth={u.dateOfBirth} />
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <span className="truncate text-sm text-foreground">{u.name}</span>
                                            <span className="truncate text-xs text-foreground/50">
                                                @{u.handle}
                                                {sign && ` · ${sign.name}`}
                                            </span>
                                        </div>
                                        {u.status === "friend" ? (
                                            <span className="flex items-center gap-1 text-xs text-accent">
                                                <Check className="size-3.5" /> Friends
                                            </span>
                                        ) : u.status === "pending" ? (
                                            <span className="text-xs text-foreground/50">Requested</span>
                                        ) : (
                                            <Button size="sm" onClick={() => add(u)} disabled={sending === u.id} className="px-3">
                                                {sending === u.id ? <Loader2 className="size-3.5 animate-spin" /> : <UserPlus className="size-3.5" />} Add
                                            </Button>
                                        )}
                                    </li>
                                )
                            })
                        )}
                    </ul>
                )}

                <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/85">
                        <Link2 className="size-4 text-accent" /> Invite friends who aren't on Quoryn yet
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-primary/25 bg-[#0f0a1f]/60 px-3 py-2">
                        <span className="min-w-0 flex-1 truncate text-xs text-foreground/60">{inviteLink}</span>
                        <Button variant="ghost" size="icon-sm" onClick={copyInvite} aria-label="Copy invite link">
                            <Copy className="size-3.5" />
                        </Button>
                    </div>
                    <Button size="md" onClick={shareInvite} className="w-full">
                        <Share2 className="size-4" /> Share invite link
                    </Button>
                    <span className="text-center text-xs text-foreground/50">Your username: @{getMyHandle()}</span>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FindFriendsDialog
