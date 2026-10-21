import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { playChime, setSoundsEnabled, soundsEnabled } from "@/lib/sound"

function SoundToggle() {
    const [on, setOn] = useState(soundsEnabled)

    function toggle() {
        const next = !on
        setOn(next)
        setSoundsEnabled(next)
        if (next) playChime()
    }

    return (
        <Button variant="ghost" size="sm" onClick={toggle} aria-pressed={on} className="px-2.5 text-foreground/70">
            {on ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />} Sound {on ? "on" : "off"}
        </Button>
    )
}

export default SoundToggle
