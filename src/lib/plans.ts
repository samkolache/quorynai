export type Plan = {
    accessType: string
    price: string
    annualPrice: string
    popular?: boolean
    benefits: string[]
}

// Shared by the pricing page and the account page's subscription section.
export const PLANS: Plan[] = [
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
