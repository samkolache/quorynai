import { Button } from "../ui/button"

function Hero() {
    return (
        <section className="py-16 sm:py-24 lg:py-54 px-6 flex flex-col gap-6 sm:gap-8 lg:gap-10 items-center max-w-4xl mx-auto text-center ">
            <h1 className=" text-[clamp(2rem,8vw,72px)] text-glow font-light">The answers you've been <br className="hidden sm:inline" /> looking for.</h1>

            <div className="flex flex-col gap-3">
                <p className="text-[clamp(1rem,2.5vw,1.25rem)]">Psychic readings, astrology, tarot, and manifestation. Built around your life, <br className="hidden md:inline" /> with extreme accuracy.</p>
                <p className="text-[clamp(0.875rem,2vw,1rem)]">No appointment. No waiting. Your reading begins now.</p>
            </div>
           
           <div className="flex flex-col gap-3">
                <Button size="cta" className="animate-pulse-glow">Begin your free reading</Button>
           </div>
            
        </section>
    )
}

export default Hero;