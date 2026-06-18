import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Sparkles, Layers, Flame, Eye } from "lucide-react";




function ChoosePath() {

    const cardContent = [
        {
            icon: <Sparkles />,
            title: "Astrology & Numerology",
            desc: "Birth charts, life path numbers, and a full numerology profile built from your birth data."
        },
        {
            icon: <Layers />,
            title: "Tarot" ,
            desc: "Draw from a living deck. Your card is chosen based on your zodiac and current energy."
        },
        {
            icon: <Flame />,
            title: "Manifestation" ,
            desc: "Daily manifestations, techniques, and interactive journaling to build the life you want."
        },
        {
            icon: <Eye />,
            title: "Psychic Reading" ,
            desc: "A conversational AI psychic that sees your situation and tells you what is coming."
        },

    ]


    return (
        <section className="flex flex-col items-center gap-12 py-12 md:py-24 max-w-6xl mx-auto text-center px-6">
            <h2 className="text-[clamp(1.875rem,5vw,3rem)] font-light">Choose your path</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
                {cardContent.map((item) => (
                    <Card key={item.title} className="
                    [--card-spacing:--spacing(6)] 
                    bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80 
                    border-primary/25 border
                    hover:glow-purple hover:border-primary"
                    >
                        <CardContent className="flex flex-col gap-4 items-start text-left">
                            <div className="flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary-foreground">
                                {item.icon}
                            </div>
                            <h3 className="font-light">{item.title}</h3>
                            <p className="text-sm">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}

export default ChoosePath;