import { useRef, useState, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom"
import { Copy, Download, Loader2, Share2, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { canShareFiles, canShareText, copyText, downloadImage, elementToPng, shareImage, shareText } from "@/lib/share"
import { cn } from "@/lib/utils"

type ShareMenuProps = {
    fileName: string
    title: string
    // Plain-text version of the reading, for copying or sharing as a message.
    text?: string
    // Either an element already on screen to capture...
    target?: RefObject<HTMLElement | null>
    // ...or a card that is drawn off screen only while the image is being made.
    card?: ReactNode
    label?: string
    // "icon" is a small round button for tight spots like under a chat message.
    variant?: "button" | "icon"
    className?: string
}

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

function ShareMenu({ fileName, title, text, target, card, label = "Share", variant = "button", className }: ShareMenuProps) {
    const [busy, setBusy] = useState(false)
    const [renderCard, setRenderCard] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    async function makeImage(): Promise<Blob> {
        if (target?.current) return elementToPng(target.current)
        setRenderCard(true)
        await nextFrame()
        // Give images inside the card (logo, tarot art) a moment to load.
        await Promise.all(
            [...(cardRef.current?.querySelectorAll("img") ?? [])].map((img) =>
                img.complete ? null : new Promise((r) => img.addEventListener("load", r, { once: true })),
            ),
        )
        try {
            return await elementToPng(cardRef.current!)
        } finally {
            setRenderCard(false)
        }
    }

    async function run(action: () => Promise<void>, failMessage: string) {
        setBusy(true)
        try {
            await action()
        } catch {
            toast.error(failMessage)
        } finally {
            setBusy(false)
        }
    }

    const shareSheet = () =>
        run(async () => {
            if (!canShareFiles()) {
                if (text) await shareText(title, text)
                return
            }
            const blob = await makeImage()
            try {
                await shareImage(blob, fileName, title, text)
            } catch (err) {
                // Some browsers (notably Safari) only allow sharing right after a tap; if building
                // the image took too long, save it instead so the user still gets it.
                if (err instanceof DOMException && err.name === "NotAllowedError") {
                    downloadImage(blob, fileName)
                    toast.success("Image saved. Post it to your story!")
                } else throw err
            }
        }, "Couldn't open sharing. Try saving the image instead.")

    const saveImage = () =>
        run(async () => {
            downloadImage(await makeImage(), fileName)
            toast.success("Image saved. Post it to your story!")
        }, "Couldn't create the image. Please try again.")

    const copy = () =>
        run(async () => {
            await copyText(text!)
            toast.success("Copied to your clipboard.")
        }, "Couldn't copy. Please try again.")

    const showShareSheet = canShareFiles() || (canShareText() && !!text)

    const trigger =
        variant === "icon" ? (
            <Button variant="ghost" size="icon-sm" aria-label={label} className={cn("text-foreground/50 hover:text-accent", className)} />
        ) : (
            <Button variant="outline" size="sm" className={cn("bg-transparent px-3", className)} />
        )

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger render={trigger} disabled={busy} data-share-exclude>
                    {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Share2 className="size-3.5" />}
                    {variant === "button" && label}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 border border-primary/30 bg-[#140e2b] p-1.5">
                    <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 text-foreground/50">Share this reading</DropdownMenuLabel>
                    {showShareSheet && (
                        <DropdownMenuItem onClick={shareSheet} className="gap-2.5 px-2 py-2">
                            <Smartphone /> Share to apps…
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={saveImage} className="gap-2.5 px-2 py-2">
                        <Download /> Save image for stories
                    </DropdownMenuItem>
                    </DropdownMenuGroup>
                    {text && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={copy} className="gap-2.5 px-2 py-2">
                                <Copy /> Copy text
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Off-screen stage for cards that only exist to be turned into images. */}
            {renderCard &&
                card &&
                createPortal(
                    <div aria-hidden className="pointer-events-none fixed top-0 -left-[10000px]">
                        <div ref={cardRef}>{card}</div>
                    </div>,
                    document.body,
                )}
        </>
    )
}

export default ShareMenu
