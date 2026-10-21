import { useState } from "react"
import { Eye } from "lucide-react"
import ChatPanel from "@/components/dashboard/ChatPanel"
import PageHeader from "@/components/dashboard/PageHeader"
import UpgradeDialog from "@/components/dashboard/UpgradeDialog"
import { isFreePlan, recordUse, remainingUses } from "@/lib/limits"
import { loadOnboarding } from "@/lib/onboarding"

function Psychic() {
    const [profile] = useState(loadOnboarding)
    const [upgradeOpen, setUpgradeOpen] = useState(false)
    const [remaining, setRemaining] = useState(() => remainingUses("psychic"))

    function canSend() {
        if (remainingUses("psychic") > 0) return true
        setUpgradeOpen(true)
        return false
    }

    function onSent() {
        recordUse("psychic")
        setRemaining(remainingUses("psychic"))
    }

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <PageHeader
                eyebrow="Psychic Reading"
                icon={<Eye className="size-3.5" />}
                title="Look into the glass"
                subtitle="Take a slow breath, quiet your thoughts, and ask what you most need to know right now."
            />

            <div className="grid items-center gap-8 lg:grid-cols-[280px_1fr]">
                {/* Crystal ball */}
                <div className="flex flex-col items-center gap-5">
                    <div className="relative size-52">
                        <div className="absolute inset-0 animate-pulse-glow rounded-full border border-accent/40 bg-[radial-gradient(circle_at_35%_30%,rgba(232,224,255,0.35),rgba(155,143,255,0.25)_25%,rgba(83,74,183,0.35)_55%,#0f0a1f_100%)]" />
                        <div className="absolute inset-6 animate-orbit-slow rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(155,143,255,0.35),transparent_40%,rgba(83,74,183,0.4),transparent_75%)] blur-md" />
                        <div className="absolute top-8 left-10 size-8 rounded-full bg-white/30 blur-sm" />
                    </div>
                    <div className="h-5 w-36 rounded-[50%] bg-gradient-to-b from-[#2a1f5c] to-[#0f0a1f] shadow-[0_8px_24px_-6px_rgba(83,74,183,0.6)]" />
                    <p className="text-center font-heading text-lg italic">Focus on one question at a time.</p>
                    {isFreePlan() && (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-foreground/75">
                            {remaining > 0 ? `${remaining} free question${remaining === 1 ? "" : "s"} left this week` : "Free questions used this week"}
                        </span>
                    )}
                </div>

                <ChatPanel
                    category="psychic"
                    context={{ profile }}
                    canSend={canSend}
                    onSent={onSent}
                    className="h-[520px]"
                    intro="I'm tuned in to your energy. What is weighing on your mind?"
                    suggestions={["What energy surrounds me right now?", "Is a change coming in my life?", "What do I need to hear today?"]}
                    placeholder="Ask what you need to know…"
                />
            </div>

            <UpgradeDialog
                open={upgradeOpen}
                onOpenChange={setUpgradeOpen}
                title="Your intuition wants more"
                description="You've asked your free psychic questions for this week. Upgrade for weekly psychic check-ins, or choose Chosen for unlimited conversations."
            />
        </div>
    )
}

export default Psychic
