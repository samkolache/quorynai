import { useState } from "react"
import { Sparkles, Layers, Flame, Eye, Check, ArrowLeft } from "lucide-react"
import StarField from "@/components/layout/StarField"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const paths = [
  {
    id: "astrology",
    icon: <Sparkles />,
    title: "Astrology & Numerology",
    features: [
      "Birth chart analysis",
      "Personalized zodiac explanations",
      "Life path number and description",
      "Expression, soul and personality numbers",
      "Full numerology chart",
    ],
  },
  {
    id: "tarot",
    icon: <Layers />,
    title: "Tarot",
    features: ["Draw from a deck and see what major life themes surround you."],
  },
  {
    id: "manifestation",
    icon: <Flame />,
    title: "Manifestation",
    features: [
      "Daily manifestations",
      "Manifestation techniques and what they mean",
      "Interactive journaling",
    ],
  },
  {
    id: "psychic",
    icon: <Eye />,
    title: "Psychic Reading",
    features: ["Chat with a psychic and see what the future holds."],
  },
]

function ChoosePathPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      <StarField />
      <div className="min-h-screen max-w-5xl mx-auto flex flex-col items-center px-6 pt-10 pb-16">
        {/* Back */}
        <div className="w-full mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground/90 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>

        {/* Brand */}
        <p className="mb-4 text-xs tracking-[0.4em] text-foreground/50 uppercase">
          Quoryn
        </p>

        {/* Heading */}
        <h1 className="mb-3 text-center text-[clamp(2.5rem,8vw,48px)] text-glow font-bold text-foreground">
          choose your path
        </h1>

        {/* Subtitle */}
        <p className="mb-12 text-center text-sm text-foreground/55 italic">
          Pick the practice you'd like me to read you through.
        </p>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {paths.map((path) => {
            const isSelected = selected === path.id
            return (
              <button
                key={path.id}
                onClick={() => setSelected(path.id)}
                className={cn(
                  "text-left rounded-xl border p-6 flex flex-col gap-5 transition-all duration-200",
                  "bg-background/40",
                  isSelected
                    ? "border-primary glow-purple"
                    : "border-primary/25 hover:border-primary/60 hover:glow-purple"
                )}
              >
                {/* Icon + title row */}
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary-foreground">
                    {path.icon}
                  </div>
                  <h3 className="font-light text-2xl text-foreground">{path.title}</h3>
                </div>

                {/* Feature list */}
                <ul className="flex flex-col gap-2.5">
                  {path.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check className="size-4 shrink-0 mt-0.5 text-primary" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        <Button
          size="cta"
          disabled={!selected}
          className="mt-10 animate-pulse-glow min-w-48"
        >
          Begin
        </Button>
      </div>
    </>
  )
}

export default ChoosePathPage
