import { Link } from "react-router-dom"
import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { PLANS } from "@/lib/plans"

type UpgradeDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
}

// Shown when a free user reaches a limit, at the moment they want more.
function UpgradeDialog({ open, onOpenChange, title, description }: UpgradeDialogProps) {
    const devoted = PLANS.find((p) => p.accessType === "Devoted")!

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="gap-6 border border-primary/40 bg-gradient-to-br from-[#1a1334] to-[#0f0a1f] p-7 glow-purple sm:max-w-md">
                <div className="flex flex-col items-center gap-3 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full border border-accent/50 bg-primary/20 animate-pulse-glow">
                        <Crown className="size-6 text-accent" />
                    </span>
                    <DialogTitle className="text-glow text-3xl font-light">{title}</DialogTitle>
                    <DialogDescription className="text-base text-foreground/70">{description}</DialogDescription>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/10 p-5">
                    <div className="flex items-baseline justify-between">
                        <span className="font-heading text-2xl">{devoted.accessType}</span>
                        <span>
                            <span className="text-xl font-semibold">{devoted.price}</span>
                            <span className="text-sm text-foreground/60">/month</span>
                        </span>
                    </div>
                    <ul className="flex flex-col gap-2">
                        {devoted.benefits.map((b) => (
                            <li key={b} className="flex items-center gap-2 text-sm text-foreground/85">
                                <Check className="size-4 text-accent" /> {b}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        render={<Link to="/dashboard/account#subscription" />}
                        nativeButton={false}
                        size="md"
                        className="w-full text-base"
                        onClick={() => onOpenChange(false)}
                    >
                        Upgrade to {devoted.accessType}
                    </Button>
                    <Button variant="ghost" size="md" onClick={() => onOpenChange(false)}>
                        Maybe later
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UpgradeDialog
