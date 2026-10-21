import { useEffect, useState } from "react"

// Chrome's install event isn't in the standard DOM types yet.
type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

// Captures the browser's "install this app" offer so we can show our own Install button.
// Returns null when the browser hasn't offered it (already installed, Safari, etc.).
export function useInstallPrompt() {
    const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)

    useEffect(() => {
        function onPrompt(e: Event) {
            e.preventDefault()
            setEvent(e as BeforeInstallPromptEvent)
        }
        function onInstalled() {
            setEvent(null)
        }
        window.addEventListener("beforeinstallprompt", onPrompt)
        window.addEventListener("appinstalled", onInstalled)
        return () => {
            window.removeEventListener("beforeinstallprompt", onPrompt)
            window.removeEventListener("appinstalled", onInstalled)
        }
    }, [])

    if (!event) return null
    return async () => {
        await event.prompt()
        await event.userChoice
        setEvent(null)
    }
}
