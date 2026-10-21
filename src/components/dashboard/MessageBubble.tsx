import type { ReactNode } from "react"
import { motion } from "motion/react"
import Markdown from "react-markdown"
import { Moon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { ChatMessage } from "@/lib/readings"
import { cn } from "@/lib/utils"

// Readings arrive as Markdown; style each piece to match the chat bubble.
const markdownComponents = {
    p: (props: React.ComponentProps<"p">) => <p className="opacity-100 [&:not(:last-child)]:mb-3" {...props} />,
    strong: (props: React.ComponentProps<"strong">) => <strong className="font-semibold text-foreground" {...props} />,
    em: (props: React.ComponentProps<"em">) => <em className="text-accent" {...props} />,
    ul: (props: React.ComponentProps<"ul">) => <ul className="mb-3 flex list-disc flex-col gap-1.5 pl-5 last:mb-0" {...props} />,
    ol: (props: React.ComponentProps<"ol">) => <ol className="mb-3 flex list-decimal flex-col gap-1.5 pl-5 last:mb-0" {...props} />,
    h3: (props: React.ComponentProps<"h3">) => <h3 className="mb-2 text-lg font-semibold" {...props} />,
}

// `actions` appear under a guide reply, e.g. the share button.
function MessageBubble({ message, animate = true, actions }: { message: ChatMessage; animate?: boolean; actions?: ReactNode }) {
    const isGuide = message.role === "guide"
    return (
        <motion.div
            initial={animate ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={cn("flex gap-3", !isGuide && "justify-end")}
        >
            {isGuide && (
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-secondary text-accent">
                    <Moon className="size-4" />
                </span>
            )}
            <div className={cn("flex max-w-[85%] flex-col gap-1", !isGuide && "items-end")}>
            <div
                className={cn(
                    "rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed",
                    isGuide ? "rounded-tl-sm border border-primary/20 bg-secondary/70 text-foreground/90" : "rounded-tr-sm bg-primary text-primary-foreground",
                )}
            >
                {isGuide ? (
                    message.text ? (
                        <Markdown components={markdownComponents}>{message.text}</Markdown>
                    ) : (
                        // Waiting for the first words of the reply.
                        <div className="flex w-56 flex-col gap-2 py-1" aria-label="Reading the stars">
                            <Skeleton className="h-3 w-full bg-primary/25" />
                            <Skeleton className="h-3 w-5/6 bg-primary/25" />
                            <Skeleton className="h-3 w-2/3 bg-primary/25" />
                        </div>
                    )
                ) : (
                    message.text
                )}
            </div>
            {actions && <div className="flex items-center gap-1 pl-1">{actions}</div>}
            </div>
        </motion.div>
    )
}

export default MessageBubble
