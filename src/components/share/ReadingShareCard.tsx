import Markdown from "react-markdown"
import { Moon } from "lucide-react"
import logo from "@/assets/logo.svg"

type ReadingShareCardProps = {
    category: string
    question?: string
    answer: string
}

// Story-sized (9:16) image of a single chat reading, drawn off screen when the user shares it.
function ReadingShareCard({ category, question, answer }: ReadingShareCardProps) {
    return (
        <div className="relative flex h-[960px] w-[540px] flex-col justify-between overflow-hidden bg-gradient-to-b from-[#221a48] via-[#140e2b] to-[#0a0a0f] p-12 text-foreground">
            <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-[radial-gradient(circle,rgba(155,143,255,0.35),transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-[radial-gradient(circle,rgba(83,74,183,0.35),transparent_70%)]" />

            <div className="relative flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full border border-accent/50 bg-primary/20">
                    <Moon className="size-5 text-accent" />
                </span>
                <span className="text-sm uppercase tracking-[0.3em] text-accent">{category} reading</span>
            </div>

            <div className="relative flex flex-col gap-8">
                {question && <p className="font-heading text-4xl leading-tight font-light text-foreground opacity-100">"{question}"</p>}
                <div className="h-px w-20 bg-accent/60" />
                <div className="text-xl leading-relaxed text-foreground/90 [&_li]:mb-2 [&_p]:mb-4 [&_p]:opacity-100 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6">
                    <Markdown>{answer.length > 520 ? `${answer.slice(0, 520).trimEnd()}…` : answer}</Markdown>
                </div>
            </div>

            <div className="relative flex items-center justify-between border-t border-primary/30 pt-6">
                <img src={logo} alt="Quoryn" className="h-8" />
                <span className="font-heading text-lg italic text-foreground/60">Ask your own question on Quoryn</span>
            </div>
        </div>
    )
}

export default ReadingShareCard
