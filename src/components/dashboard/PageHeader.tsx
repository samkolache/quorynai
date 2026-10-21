import type { ReactNode } from "react"

type PageHeaderProps = {
    eyebrow: string
    icon: ReactNode
    title: string
    subtitle: string
}

function PageHeader({ eyebrow, icon, title, subtitle }: PageHeaderProps) {
    return (
        <header className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent">
                {icon} {eyebrow}
            </span>
            <h1 className="text-glow text-4xl font-light md:text-5xl">{title}</h1>
            <p className="max-w-2xl text-lg leading-relaxed">{subtitle}</p>
        </header>
    )
}

export default PageHeader
