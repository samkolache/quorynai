import { useRef, useState } from "react"
import { motion } from "motion/react"
import { Layers, RotateCcw } from "lucide-react"
import ChatPanel from "@/components/dashboard/ChatPanel"
import PageHeader from "@/components/dashboard/PageHeader"
import SoundToggle from "@/components/dashboard/SoundToggle"
import UpgradeDialog from "@/components/dashboard/UpgradeDialog"
import ShareMenu from "@/components/share/ShareMenu"
import ShareFooter from "@/components/share/ShareFooter"
import TarotCardFlip, { CardBack } from "@/components/tarot/TarotCardFlip"
import { Button } from "@/components/ui/button"
import { isFreePlan, nextResetDate, recordUse, remainingUses } from "@/lib/limits"
import { loadOnboarding } from "@/lib/onboarding"
import { playChime } from "@/lib/sound"
import { MAJOR_ARCANA, SPREAD_POSITIONS, shuffle, type TarotCard } from "@/lib/tarot"

const DECK_SIZE = 12

function Tarot() {
    const [profile] = useState(loadOnboarding)
    const [deck, setDeck] = useState(() => shuffle(MAJOR_ARCANA).slice(0, DECK_SIZE))
    const [drawn, setDrawn] = useState<TarotCard[]>([])
    const [revealed, setRevealed] = useState(0)
    const [upgradeOpen, setUpgradeOpen] = useState(false)
    const [remaining, setRemaining] = useState(() => remainingUses("tarot"))
    // Bumping this remounts the chat so a new spread starts a fresh conversation.
    const [spreadId, setSpreadId] = useState(0)
    const spreadRef = useRef<HTMLDivElement>(null)

    const complete = revealed === SPREAD_POSITIONS.length
    const full = drawn.length === SPREAD_POSITIONS.length

    function draw(index: number) {
        if (full) return
        // Starting a new spread uses one of the free plan's weekly draws.
        if (drawn.length === 0) {
            if (remainingUses("tarot") === 0) {
                setUpgradeOpen(true)
                return
            }
            recordUse("tarot")
            setRemaining(remainingUses("tarot"))
        }
        setDrawn((d) => [...d, deck[index]])
        setDeck((d) => d.filter((_, i) => i !== index))
        // Let the card land in its slot face down, then turn it over.
        setTimeout(() => {
            setRevealed((r) => r + 1)
            playChime()
        }, 450)
    }

    function reset() {
        setDeck(shuffle(MAJOR_ARCANA).slice(0, DECK_SIZE))
        setDrawn([])
        setRevealed(0)
        setSpreadId((n) => n + 1)
    }

    const drawnCards = drawn.slice(0, revealed).map((card, i) => ({ position: SPREAD_POSITIONS[i], card }))
    const resetDate = nextResetDate("tarot")

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <PageHeader
                eyebrow="Tarot"
                icon={<Layers className="size-3.5" />}
                title="Draw your spread"
                subtitle="Hold your question in mind and choose three cards from the deck: your past, your present, and your future."
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
                {isFreePlan() ? (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-foreground/75">
                        {remaining > 0
                            ? `${remaining} free spread${remaining === 1 ? "" : "s"} left this week`
                            : `Next free spread ${resetDate ? resetDate.toLocaleDateString(undefined, { weekday: "long" }) : "soon"}`}
                    </span>
                ) : (
                    <span className="text-sm text-foreground/60">Unlimited spreads</span>
                )}
                <SoundToggle />
            </div>

            {/* Face-down deck fanned out */}
            <div className="flex flex-col items-center gap-4">
                <div className="flex h-36 w-full items-end justify-center">
                    {deck.map((card, i) => {
                        const offset = i - (deck.length - 1) / 2
                        return (
                            <motion.button
                                key={card.name}
                                layout
                                type="button"
                                onClick={() => draw(i)}
                                disabled={full}
                                aria-label="Draw this card"
                                className="-mx-3 disabled:cursor-default disabled:opacity-40 sm:-mx-2"
                                style={{ rotate: offset * 4, y: Math.abs(offset) * 3 }}
                                whileHover={full ? undefined : { y: -16 }}
                                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            >
                                <CardBack className="h-28 w-[4.5rem] sm:h-32 sm:w-20" />
                            </motion.button>
                        )
                    })}
                </div>
                <p className="text-sm">
                    {full ? "Your spread is ready. Ask your question below." : `Choose ${SPREAD_POSITIONS.length - drawn.length} more card${SPREAD_POSITIONS.length - drawn.length === 1 ? "" : "s"}.`}
                </p>
            </div>

            {/* Spread slots: drawn cards land face down, then flip */}
            <div ref={spreadRef} className="flex flex-col gap-5 rounded-2xl p-4 sm:p-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-6">
                    {SPREAD_POSITIONS.map((position, i) => {
                        const card = drawn[i]
                        const isRevealed = i < revealed
                        return (
                            <div key={position} className="flex flex-col items-center gap-3">
                                <span className="text-xs uppercase tracking-[0.25em] text-accent">{position}</span>
                                <div className="w-full max-w-44">
                                    {card ? (
                                        <motion.div initial={{ opacity: 0, y: -40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }}>
                                            <TarotCardFlip card={card} revealed={isRevealed} />
                                        </motion.div>
                                    ) : (
                                        <div className="aspect-[330/554] w-full rounded-xl border border-dashed border-primary/40 bg-primary/5" />
                                    )}
                                </div>
                                {card && isRevealed && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col items-center gap-1 text-center">
                                        <span className="font-heading text-base leading-tight sm:text-xl">{card.name}</span>
                                        <span className="hidden text-sm text-foreground/60 sm:block">{card.meaning}</span>
                                    </motion.div>
                                )}
                            </div>
                        )
                    })}
                </div>
                {complete && <ShareFooter />}
            </div>

            {drawn.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3">
                    {complete && (
                        <ShareMenu
                            target={spreadRef}
                            fileName="quoryn-tarot-spread"
                            title="My tarot spread"
                            label="Share spread"
                            text={`My tarot spread ✨\n\n${drawnCards.map((d) => `${d.position}: ${d.card.name}`).join("\n")}\n\nDraw your own on Quoryn.`}
                        />
                    )}
                    <Button variant="outline" size="sm" onClick={reset} className="bg-transparent px-3">
                        <RotateCcw className="size-3.5" /> Shuffle and start over
                    </Button>
                </div>
            )}

            <ChatPanel
                key={spreadId}
                category="tarot"
                context={{ profile, drawnCards }}
                detail={drawnCards.map((d) => d.card.name).join(", ")}
                className="h-[460px]"
                intro="Draw three cards from the deck. Once your spread is laid out, ask me what you'd like to know."
                suggestions={["What does this spread mean for my love life?", "What is this spread telling me about my career?", "What should I let go of?"]}
                disabledReason={complete ? undefined : "Draw three cards to begin…"}
                placeholder="Ask the cards your question…"
            />

            <UpgradeDialog
                open={upgradeOpen}
                onOpenChange={setUpgradeOpen}
                title="The cards are calling"
                description="You've used your free spread for this week. Upgrade to draw as many spreads as you like, whenever you need guidance."
            />
        </div>
    )
}

export default Tarot
