import type { ReactNode } from "react"
import { BookOpen, Eye, Heart, Layers, Sparkles } from "lucide-react"
import type { ReadingCategory } from "@/lib/readings"

export type Category = {
    id: ReadingCategory
    path: string
    label: string
    // Fits under an icon in the mobile bottom bar.
    shortLabel: string
    icon: ReactNode
    blurb: string
}

// Shared by the sidebar, the mobile bar, and the overview cards so they stay in sync.
export const CATEGORIES: Category[] = [
    {
        id: "astrology",
        path: "/dashboard/astrology",
        label: "Astrology & Numerology",
        shortLabel: "Astrology",
        icon: <Sparkles className="size-4" />,
        blurb: "Your birth chart, planets, and life path number.",
    },
    {
        id: "tarot",
        path: "/dashboard/tarot",
        label: "Tarot",
        shortLabel: "Tarot",
        icon: <Layers className="size-4" />,
        blurb: "Draw a three-card spread and ask what it means.",
    },
    {
        id: "manifestation",
        path: "/dashboard/manifestation",
        label: "Manifestation",
        shortLabel: "Journal",
        icon: <BookOpen className="size-4" />,
        blurb: "Keep a journal of intentions and shape them with your guide.",
    },
    {
        id: "psychic",
        path: "/dashboard/psychic",
        label: "Psychic Reading",
        shortLabel: "Psychic",
        icon: <Eye className="size-4" />,
        blurb: "Focus your energy and ask what's ahead.",
    },
    {
        id: "compatibility",
        path: "/dashboard/compatibility",
        label: "Compatibility",
        shortLabel: "Match",
        icon: <Heart className="size-4" />,
        blurb: "Compare your chart with a partner, friend, or crush.",
    },
]
