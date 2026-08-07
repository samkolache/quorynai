import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"



function Pricing() {

    const cardContent = [
        {
            accessType: "Seeker",
            price: "$0.00",
            annualPrice: "$0.00",
            benefits: [
                "Daily affirmation",
                "Basic numerology snapshot",
                "One tarot draw per week"
            ]
        },
        {
            accessType: "Devoted",
            price: "$9.99",
            annualPrice: "$7.99",
            popular: true,
            benefits: [
                "Unlimited tarot draws",
                "Full birth chart & numerology",
                "Manifestation journaling",
                "Weekly psychic check-ins"
            ]
        },
        {
            accessType: "Chosen",
            price: "$19.99",
            annualPrice: "$15.99",
            benefits: [
                "Everything in Devoted",
                "Unlimited psychic conversations",
                "Priority readings",
                "Personalized monthly forecast"
            ]
        }
    ]


    const [billing, setBilling] = useState<"monthly" | "annual">("monthly")
    const isAnnual = billing === "annual"

    return (
        <section className="max-w-6xl mx-auto flex flex-col gap-8 items-center text-center py-12 md:py-24 px-6">
            <h2 className="text-[clamp(1.875rem,5vw,3rem)] font-light">Choose your access</h2>

            <ToggleGroup
                value={[billing]}
                onValueChange={(value) => {
                    if (value[0]) setBilling(value[0] as "monthly" | "annual")
                }}
                spacing={1}
                className="rounded-full border border-primary/40 bg-[#0f0a1f]/60 p-1.5 shadow-[0_0_40px_-12px] shadow-primary/30"
            >
                <ToggleGroupItem
                    value="monthly"
                    aria-label="Monthly billing"
                    className="h-auto rounded-full px-4 py-1.5 text-sm font-semibold text-foreground/70 transition-all hover:bg-transparent hover:text-foreground aria-pressed:bg-primary-hover aria-pressed:text-white data-[state=on]:bg-primary-hover data-[state=on]:text-white"
                >
                    Monthly
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="annual"
                    aria-label="Annual billing"
                    className="h-auto rounded-full px-4 py-1.5 text-sm font-medium text-foreground/70 transition-all hover:bg-transparent hover:text-foreground aria-pressed:bg-primary-hover aria-pressed:text-white data-[state=on]:bg-primary-hover data-[state=on]:text-white"
                >
                    Annual
                    <span className="ml-2 text-xs font-semibold text-accent">-20%</span>
                </ToggleGroupItem>
            </ToggleGroup>

            <div className="mt-4 flex flex-col md:flex-row w-full items-center justify-center gap-12 md:gap-6">
                {cardContent.map((item) => (
                    <Card
                        key={item.accessType}
                        className={cn(
                            "relative flex-1 self-stretch [--card-spacing:--spacing(7)]",
                            "bg-gradient-to-br from-[#1a1334]/80 to-[#0f0a1f]/80",
                            item.popular
                                ? "z-10 scale-105 border border-primary glow-purple overflow-visible"
                                : "border border-primary/25 opacity-90"
                        )}
                    >
                        {item.popular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold tracking-widest text-white">
                                MOST POPULAR
                            </span>
                        )}
                        <CardContent className="flex h-full flex-col items-start gap-6 text-left">
                            <h3 className="font-heading text-2xl font-light">{item.accessType}</h3>

                            <div className="flex items-baseline gap-1.5">
                                <span className="font-heading text-[clamp(2.625rem,2.5rem+0.625vw,3rem)] font-light">
                                    {isAnnual ? item.annualPrice : item.price}
                                </span>
                                {(isAnnual ? item.annualPrice : item.price) !== "$0.00" && (
                                    <span className="text-foreground/60">
                                        {isAnnual ? "/mo, billed yearly" : "/month"}
                                    </span>
                                )}
                            </div>

                            <ul className="flex w-full flex-col gap-3">
                                {item.benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-start gap-3">
                                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={item.popular ? "default" : "outline"}
                                size="md"
                                className={cn("mt-auto w-full", !item.popular && "bg-transparent")}
                            >
                                Choose {item.accessType}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </section>
    )
}

export default Pricing;