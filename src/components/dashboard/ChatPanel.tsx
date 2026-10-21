import { useEffect, useRef, useState, type FormEvent } from "react"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveSession } from "@/lib/history"
import { stripMarkdown } from "@/lib/share"
import { streamReading, type ChatMessage, type ReadingCategory, type ReadingContext } from "@/lib/readings"
import { cn } from "@/lib/utils"
import ReadingShareCard from "@/components/share/ReadingShareCard"
import ShareMenu from "@/components/share/ShareMenu"
import MessageBubble from "./MessageBubble"
import { CATEGORIES } from "./categories"
import ReadingHistory from "./ReadingHistory"

type ChatPanelProps = {
    category: ReadingCategory
    context: ReadingContext
    intro: string
    suggestions?: string[]
    placeholder?: string
    // Lets a page block questions until it's ready, e.g. tarot before cards are drawn.
    disabledReason?: string
    // Saved with the reading in history, e.g. which cards were drawn.
    detail?: string
    // Called before each question; return false to stop it (e.g. the free plan limit was reached).
    canSend?: () => boolean
    onSent?: () => void
    className?: string
}

function ChatPanel({ category, context, intro, suggestions = [], placeholder, disabledReason, detail, canSend, onSent, className }: ChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([{ role: "guide", text: intro }])
    const [draft, setDraft] = useState("")
    const [thinking, setThinking] = useState(false)
    const [sessionId] = useState(() => crypto.randomUUID())
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages])

    async function send(text: string) {
        const trimmed = text.trim()
        if (!trimmed || thinking || disabledReason) return
        if (canSend && !canSend()) return
        onSent?.()

        const history: ChatMessage[] = [...messages, { role: "user", text: trimmed }]
        // An empty guide message shows the loading placeholder until text streams in.
        setMessages([...history, { role: "guide", text: "" }])
        setDraft("")
        setThinking(true)

        let reply = ""
        try {
            for await (const chunk of streamReading(category, history, context)) {
                reply += chunk
                setMessages([...history, { role: "guide", text: reply }])
            }
        } catch {
            reply = reply || "The connection to the stars flickered. Please try again."
            setMessages([...history, { role: "guide", text: reply }])
        } finally {
            setThinking(false)
        }

        const firstQuestion = history.find((m) => m.role === "user")!.text
        saveSession({
            id: sessionId,
            category,
            title: firstQuestion,
            detail,
            updatedAt: new Date().toISOString(),
            messages: [...history, { role: "guide", text: reply }],
        })
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        send(draft)
    }

    const categoryLabel = CATEGORIES.find((c) => c.id === category)?.shortLabel ?? "Quoryn"
    const showSuggestions = suggestions.length > 0 && messages.length === 1 && !disabledReason

    return (
        <div
            className={cn(
                "flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80 backdrop-blur-sm",
                className,
            )}
        >
            <div className="flex items-center justify-between border-b border-primary/20 px-4 py-2">
                <span className="flex items-center gap-2 font-heading text-lg italic text-foreground/80">
                    <span className="size-2 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Your guide
                </span>
                <ReadingHistory category={category} />
            </div>

            <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto p-5" aria-live="polite">
                {messages.map((m, i) => {
                    const question = messages[i - 1]?.role === "user" ? messages[i - 1].text : undefined
                    // Replies to a question can be shared once they've finished streaming.
                    const shareable = m.role === "guide" && !!question && !!m.text && !(thinking && i === messages.length - 1)
                    return (
                        <MessageBubble
                            key={i}
                            message={m}
                            actions={
                                shareable && (
                                    <ShareMenu
                                        label="Share"
                                        className="h-7 border-primary/25 px-2.5 text-xs text-foreground/70"
                                        fileName={`quoryn-${category}-reading`}
                                        title={`My ${categoryLabel} reading`}
                                        text={`I asked Quoryn: "${question}"\n\n${stripMarkdown(m.text)}`}
                                        card={<ReadingShareCard category={categoryLabel} question={question} answer={m.text} />}
                                    />
                                )
                            }
                        />
                    )
                })}

                {showSuggestions && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                        {suggestions.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => send(s)}
                                className="rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm text-foreground/80 transition-colors hover:border-primary hover:bg-primary/20"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-primary/20 p-3">
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={disabledReason ?? placeholder ?? "Ask your question…"}
                    disabled={!!disabledReason}
                    aria-label="Your question"
                    className="h-11 flex-1 rounded-full border border-primary/30 bg-[#0f0a1f]/60 px-4 text-sm text-foreground placeholder:text-foreground/40 outline-none focus-visible:border-primary disabled:opacity-60"
                />
                <Button type="submit" size="icon-lg" disabled={!draft.trim() || thinking || !!disabledReason} aria-label="Send" className="size-11">
                    <SendHorizontal className="size-4" />
                </Button>
            </form>
        </div>
    )
}

export default ChatPanel
