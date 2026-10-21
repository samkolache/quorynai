import { motion } from "motion/react"
import { Sparkles } from "lucide-react"
import type { TarotCard } from "@/lib/tarot"
import { cn } from "@/lib/utils"

export function CardBack({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-xl border border-primary/60 bg-[radial-gradient(circle_at_center,#2a1f5c,#0f0a1f)] shadow-lg",
                className,
            )}
        >
            <div className="flex size-[72%] items-center justify-center rounded-lg border border-accent/30 bg-[repeating-conic-gradient(from_0deg,rgba(155,143,255,0.06)_0deg_15deg,transparent_15deg_30deg)]">
                <Sparkles className="size-5 text-accent/80" />
            </div>
        </div>
    )
}

export function CardFace({ card, className }: { card: TarotCard; className?: string }) {
    return (
        <div className={cn("overflow-hidden rounded-xl border border-accent/60 bg-[#f4ecda] glow-purple", className)}>
            <img src={card.image} alt={card.name} className="size-full object-cover" draggable={false} />
        </div>
    )
}

type TarotCardFlipProps = {
    card: TarotCard
    revealed: boolean
    onReveal?: () => void
    className?: string
}

// A card that turns over in 3D, from its back to the Rider-Waite artwork.
function TarotCardFlip({ card, revealed, onReveal, className }: TarotCardFlipProps) {
    return (
        <button
            type="button"
            onClick={onReveal}
            disabled={revealed || !onReveal}
            aria-label={revealed ? card.name : "Reveal card"}
            className={cn("block aspect-[330/554] w-full [perspective:1200px] disabled:cursor-default", className)}
        >
            <motion.div
                className="relative size-full [transform-style:preserve-3d]"
                initial={false}
                animate={{ rotateY: revealed ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
                <CardBack className="absolute inset-0 [backface-visibility:hidden]" />
                <CardFace card={card} className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]" />
            </motion.div>
        </button>
    )
}

export default TarotCardFlip
