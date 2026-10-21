import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

type ConfirmDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel: ReactNode
    cancelLabel: string
    onConfirm: () => void
}

// For destructive actions; the safe choice is always the easy one to reach.
function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, cancelLabel, onConfirm }: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="gap-5 border border-primary/40 bg-gradient-to-br from-[#1a1334] to-[#0f0a1f] p-6 sm:max-w-md">
                <div className="flex flex-col gap-2">
                    <DialogTitle className="text-2xl font-normal">{title}</DialogTitle>
                    <DialogDescription className="text-base text-foreground/70">{description}</DialogDescription>
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button variant="ghost" size="md" onClick={() => onOpenChange(false)}>
                        {cancelLabel}
                    </Button>
                    <Button
                        size="md"
                        onClick={() => {
                            onConfirm()
                            onOpenChange(false)
                        }}
                        className="bg-destructive text-white hover:bg-destructive/80"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmDialog
