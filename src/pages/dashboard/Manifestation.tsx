import { useState, type FormEvent } from "react"
import { BookOpen, Feather, Flame, X } from "lucide-react"
import { motion } from "motion/react"
import { toast } from "sonner"
import InfoTip from "@/components/astro/InfoTip"
import ChatPanel from "@/components/dashboard/ChatPanel"
import PageHeader from "@/components/dashboard/PageHeader"
import { getStreak, loadNotes, saveNotes, type JournalNote } from "@/lib/journal"
import { localDateKey } from "@/lib/daily"
import { loadOnboarding } from "@/lib/onboarding"

const PROMPTS = ["I am…", "I am grateful for…", "I am ready to receive…", "This year, I…"]

// Ruled-paper lines for the journal pages; 2rem matches the text's line height.
const ruled = {
    backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent calc(2rem - 1px), rgba(83,74,183,0.18) calc(2rem - 1px), rgba(83,74,183,0.18) 2rem)",
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
}

function Manifestation() {
    const [profile] = useState(loadOnboarding)
    const [notes, setNotes] = useState<JournalNote[]>(loadNotes)
    const [draft, setDraft] = useState("")

    const streak = getStreak(notes)
    const wroteToday = notes.some((n) => localDateKey(new Date(n.createdAt)) === localDateKey())

    function remove(note: JournalNote) {
        update(notes.filter((x) => x.id !== note.id))
        toast("Entry removed", { action: { label: "Undo", onClick: () => update(notes) } })
    }

    function update(next: JournalNote[]) {
        setNotes(next)
        saveNotes(next)
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const text = draft.trim()
        if (!text) return
        const firstToday = !notes.some((n) => localDateKey(new Date(n.createdAt)) === localDateKey())
        const next = [{ id: crypto.randomUUID(), text, createdAt: new Date().toISOString() }, ...notes]
        update(next)
        setDraft("")
        const days = getStreak(next)
        toast.success(firstToday && days > 1 ? `Added to your journal. ${days}-day streak!` : "Added to your journal.")
    }

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <PageHeader
                eyebrow="Manifestation"
                icon={<BookOpen className="size-3.5" />}
                title="Your manifestation journal"
                subtitle="Write your intentions as if they're already true. Your guide can help you shape them into words the universe can hear."
            />

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-primary/30 bg-secondary/50 px-5 py-4">
                <motion.span
                    key={streak}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`flex size-12 items-center justify-center rounded-full border ${streak ? "border-orange-300/50 bg-orange-400/15 text-orange-300" : "border-primary/40 bg-primary/10 text-accent"}`}
                >
                    <Flame className="size-5" />
                </motion.span>
                <div className="flex flex-1 flex-col">
                    <span className="flex items-center gap-1.5 font-heading text-2xl">
                        {streak ? `${streak}-day streak` : "Start your streak"} <InfoTip term="streak" />
                    </span>
                    <span className="text-sm text-foreground/60">
                        {wroteToday ? "You've written today. Come back tomorrow to keep it going." : streak ? "Write today's intention to keep your streak alive." : "Write one intention a day and watch your streak grow."}
                    </span>
                </div>
                {/* Last 7 days at a glance */}
                <div className="flex gap-1.5" aria-label="Last 7 days">
                    {Array.from({ length: 7 }, (_, i) => {
                        const d = new Date()
                        d.setDate(d.getDate() - (6 - i))
                        const key = localDateKey(d)
                        const done = notes.some((n) => localDateKey(new Date(n.createdAt)) === key)
                        return (
                            <span key={key} className="flex flex-col items-center gap-1">
                                <span className={`size-3 rounded-full ${done ? "bg-orange-300 shadow-[0_0_8px_rgba(253,186,116,0.7)]" : "bg-primary/25"}`} />
                                <span className="text-[0.65rem] text-foreground/45">{d.toLocaleDateString(undefined, { weekday: "narrow" })}</span>
                            </span>
                        )
                    })}
                </div>
            </div>

            {/* Open book: write on the left page, past entries on the right */}
            <div className="relative grid overflow-hidden rounded-2xl border border-[#c9b98f]/40 bg-[#f4ecda] text-[#2a1f3d] shadow-[0_20px_60px_-20px_rgba(83,74,183,0.6)] md:grid-cols-2">
                {/* spine shadow */}
                <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-12 -translate-x-1/2 bg-[linear-gradient(to_right,transparent,rgba(42,31,61,0.18),transparent)] md:block" />

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 md:p-8">
                    <div className="flex items-baseline justify-between">
                        <h2 className="font-heading text-3xl font-semibold italic">Today's intention</h2>
                        <span className="font-heading text-sm italic text-[#2a1f3d]/60">{formatDate(new Date().toISOString())}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {PROMPTS.map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setDraft(p.replace("…", " "))}
                                className="rounded-full border border-[#534AB7]/30 px-3 py-1 font-heading text-sm italic text-[#534AB7] transition-colors hover:bg-[#534AB7]/10"
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="I am stepping into the life I've been dreaming of…"
                        aria-label="Write your intention"
                        rows={6}
                        style={ruled}
                        className="w-full flex-1 resize-none bg-transparent font-heading text-xl leading-8 text-[#2a1f3d] placeholder:text-[#2a1f3d]/35 outline-none"
                    />

                    <button
                        type="submit"
                        disabled={!draft.trim()}
                        className="flex w-fit items-center gap-2 self-end rounded-full bg-[#534AB7] px-5 py-2.5 text-sm font-medium text-[#f4ecda] transition-colors hover:bg-[#6357d1] disabled:opacity-40"
                    >
                        <Feather className="size-4" /> Add to journal
                    </button>
                </form>

                <div className="flex max-h-[460px] flex-col gap-4 overflow-y-auto border-t border-[#c9b98f]/50 p-6 md:border-t-0 md:p-8">
                    <h2 className="font-heading text-3xl font-semibold italic">Past entries</h2>
                    {notes.length === 0 ? (
                        <p className="font-heading text-lg italic text-[#2a1f3d]/60 opacity-100">
                            Your first intention will appear here. Every page starts blank.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-5">
                            {notes.map((n) => (
                                <li key={n.id} className="group relative border-b border-dashed border-[#c9b98f]/70 pb-4">
                                    <span className="font-heading text-sm italic text-[#534AB7]">{formatDate(n.createdAt)}</span>
                                    <p className="font-heading text-xl leading-snug whitespace-pre-wrap text-[#2a1f3d] opacity-100">{n.text}</p>
                                    <button
                                        type="button"
                                        onClick={() => remove(n)}
                                        aria-label="Remove entry"
                                        className="absolute top-0 right-0 rounded-full p-1 text-[#2a1f3d]/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#2a1f3d] focus-visible:opacity-100"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <ChatPanel
                category="manifestation"
                context={{ profile }}
                className="h-[460px]"
                intro="What are you calling into your life? Tell me, and I'll help you shape it into an intention you can write in your journal."
                suggestions={["Help me write an intention for love", "How do I manifest a new job?", "Give me an affirmation for confidence"]}
                placeholder="Tell your guide what you want to manifest…"
            />
        </div>
    )
}

export default Manifestation
