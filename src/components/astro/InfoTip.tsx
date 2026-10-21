import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { GLOSSARY } from "@/lib/content"

function InfoTip({ term, label }: { term: keyof typeof GLOSSARY; label?: string }) {
    return (
        <Tooltip>
            <TooltipTrigger
                render={<button type="button" />}
                aria-label={label ?? "What does this mean?"}
                className="inline-flex text-foreground/40 transition-colors hover:text-accent"
                data-share-exclude
            >
                <Info className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent className="max-w-64 text-left leading-relaxed">{GLOSSARY[term]}</TooltipContent>
        </Tooltip>
    )
}

export default InfoTip
