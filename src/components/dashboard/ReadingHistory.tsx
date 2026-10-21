import { useState } from "react"
import { ChevronLeft, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { loadHistory, type ReadingSession } from "@/lib/history"
import type { ReadingCategory } from "@/lib/readings"
import ReadingShareCard from "@/components/share/ReadingShareCard"
import ShareMenu from "@/components/share/ShareMenu"
import { stripMarkdown } from "@/lib/share"
import MessageBubble from "./MessageBubble"
import { CATEGORIES } from "./categories"

function formatWhen(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
}

// Shares the first question with the latest answer from a saved reading.
function SessionShare({ session }: { session: ReadingSession }) {
    const label = CATEGORIES.find((c) => c.id === session.category)?.shortLabel ?? "Quoryn"
    const answer = [...session.messages].reverse().find((m) => m.role === "guide")?.text ?? ""
    return (
        <ShareMenu
            fileName={`quoryn-${session.category}-reading`}
            title={`My ${label} reading`}
            text={`I asked Quoryn: "${session.title}"\n\n${stripMarkdown(answer)}`}
            card={<ReadingShareCard category={label} question={session.title} answer={answer} />}
        />
    )
}

// Slide-out list of past readings for one category, with a read-only transcript view.
function ReadingHistory({ category }: { category: ReadingCategory }) {
    const [sessions, setSessions] = useState<ReadingSession[]>([])
    const [selected, setSelected] = useState<ReadingSession | null>(null)

    return (
        <Sheet
            onOpenChange={(open) => {
                if (open) setSessions(loadHistory(category))
                else setSelected(null)
            }}
        >
            <SheetTrigger render={<Button variant="ghost" size="sm" className="px-2.5 text-foreground/70" />}>
                <History className="size-3.5" /> Past readings
            </SheetTrigger>
            <SheetContent className="w-full gap-0 border-primary/30 bg-[#0f0a1f]/95 backdrop-blur-md sm:max-w-md">
                <SheetHeader className="border-b border-primary/20 p-5">
                    {selected ? (
                        <div className="flex items-center justify-between gap-3 pr-8">
                            <button type="button" onClick={() => setSelected(null)} className="flex w-fit items-center gap-1 text-sm text-accent hover:underline">
                                <ChevronLeft className="size-4" /> All readings
                            </button>
                            <SessionShare session={selected} />
                        </div>
                    ) : null}
                    <SheetTitle className="font-heading text-2xl font-light">{selected ? selected.title : "Past readings"}</SheetTitle>
                    <SheetDescription className="text-foreground/55">
                        {selected ? (selected.detail ?? formatWhen(selected.updatedAt)) : "Revisit what the stars told you."}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5">
                    {selected ? (
                        <div className="flex flex-col gap-4">
                            {selected.messages.map((m, i) => (
                                <MessageBubble key={i} message={m} animate={false} />
                            ))}
                        </div>
                    ) : sessions.length === 0 ? (
                        <p className="font-heading text-lg italic">No readings yet. Ask your first question and it will be saved here.</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {sessions.map((s) => (
                                <li key={s.id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelected(s)}
                                        className="flex w-full flex-col gap-1 rounded-xl border border-primary/20 bg-secondary/40 p-4 text-left transition-colors hover:border-primary/60 hover:bg-secondary/70"
                                    >
                                        <span className="line-clamp-2 text-sm text-foreground/90">{s.title}</span>
                                        <span className="text-xs text-foreground/50">
                                            {formatWhen(s.updatedAt)}
                                            {s.detail && ` · ${s.detail}`}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ReadingHistory
