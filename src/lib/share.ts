import { toBlob } from "html-to-image"

export async function elementToPng(node: HTMLElement): Promise<Blob> {
    const blob = await toBlob(node, {
        pixelRatio: 2,
        backgroundColor: "#0a0a0f",
        // Anything marked data-share-exclude (like the share button itself) is left out of the image.
        filter: (el) => !(el instanceof HTMLElement && el.dataset.shareExclude !== undefined),
    })
    if (!blob) throw new Error("Could not create image")
    return blob
}

// True on phones and some desktop browsers that can hand an image to other apps.
export function canShareFiles(): boolean {
    try {
        const probe = new File([new Blob()], "probe.png", { type: "image/png" })
        return !!navigator.canShare?.({ files: [probe] })
    } catch {
        return false
    }
}

export function canShareText(): boolean {
    return typeof navigator.share === "function"
}

// Opens the system share sheet (Instagram, Messages, WhatsApp, etc.). Returns false if the user backed out.
export async function shareImage(blob: Blob, fileName: string, title: string, text?: string): Promise<boolean> {
    const file = new File([blob], `${fileName}.png`, { type: "image/png" })
    try {
        await navigator.share({ files: [file], title, text })
        return true
    } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return false
        throw err
    }
}

export async function shareText(title: string, text: string): Promise<boolean> {
    try {
        await navigator.share({ title, text })
        return true
    } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return false
        throw err
    }
}

export function downloadImage(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName}.png`
    a.click()
    URL.revokeObjectURL(url)
}

export async function copyText(text: string) {
    await navigator.clipboard.writeText(text)
}

// Plain-text version of a Markdown reply, for copying or sending as a message.
export function stripMarkdown(text: string) {
    return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/^#+\s*/gm, "").replace(/^- /gm, "• ")
}
