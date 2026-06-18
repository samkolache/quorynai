function Steps() {

    const stepContent = [
        {
            number: "01",
            title: "Create your profile",
            desc: "Enter your birth details in 60 seconds. Your name, date, time, and place of birth."
        },
        {
            number: "02",
            title: "Choose your path",
            desc: "Pick astrology, tarot, manifestation, or psychic reading — or explore all four."
        },
        {
            number: "03",
            title: "Get your reading",
            desc: "A personalized conversation that knows your situation and gives you real answers."
        },

    ]


    return (
        <section className="flex flex-col items-center gap-10 md:gap-12 py-12 md:py-24 max-w-6xl mx-auto text-center px-6">
            <h2 className="text-[clamp(1.875rem,5vw,3rem)] font-light">How it works</h2>
            <div className="flex flex-col md:flex-row gap-10 md:gap-12">
                {stepContent.map((step) => (
                    <div key={step.number} className="flex flex-1 flex-col gap-3 text-left">
                        <span className="text-[clamp(3rem,2.75rem+1.25vw,3.75rem)] font-heading text-glow text-primary">{step.number}</span>
                        <h3 className="font-light font-heading">{step.title}</h3>
                        <p>{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Steps;
