import { getSunSign } from "@/lib/astro"
import { cn } from "@/lib/utils"

// Initial in a circle, tinted by name so friends are easy to tell apart, with their sun sign badge.
function FriendAvatar({ name, dateOfBirth, size = "md" }: { name: string; dateOfBirth: string; size?: "md" | "lg" }) {
    const hue = [...name].reduce((h, c) => h + c.charCodeAt(0), 0) % 360
    const sign = getSunSign(dateOfBirth)
    return (
        <span className="relative inline-flex shrink-0">
            <span
                className={cn("flex items-center justify-center rounded-full border border-white/15 font-heading text-foreground", size === "lg" ? "size-16 text-3xl" : "size-11 text-xl")}
                style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${(hue + 50) % 360} 50% 22%))` }}
            >
                {name.charAt(0).toUpperCase()}
            </span>
            {sign && (
                <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border border-primary/50 bg-[#140e2b] text-[0.65rem] text-accent">
                    {sign.symbol}
                </span>
            )}
        </span>
    )
}

export default FriendAvatar
