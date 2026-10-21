import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

type AuthCardProps = {
    eyebrow: string
    title: string
    subtitle: string
    children: ReactNode
}

function AuthCard({ eyebrow, title, subtitle, children }: AuthCardProps) {
    return (
        <section className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-lg items-center px-6 py-12">
            <Card className="w-full border border-primary/40 bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80 glow-purple [--card-spacing:--spacing(8)]">
                <CardContent className="flex flex-col gap-7">
                    <div className="flex flex-col gap-2 text-center">
                        <span className="text-xs uppercase tracking-[0.25em] text-accent">{eyebrow}</span>
                        <h1 className="text-glow text-[clamp(2rem,6vw,2.75rem)] font-light">{title}</h1>
                        <p>{subtitle}</p>
                    </div>
                    {children}
                </CardContent>
            </Card>
        </section>
    )
}

export default AuthCard
