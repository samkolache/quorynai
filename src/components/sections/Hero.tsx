import { Button } from "../ui/button"

function Hero() {
    return (
        <section className=" py-32 flex flex-col gap-10 items-center max-w-4xl mx-auto text-center ">
            <h1 className="text-[72px] text-glow font-medium">The answers you've been <br /> looking for.</h1>

            <div className="flex flex-col gap-3">
                <p className="text-xl">Psychic readings, astrology, tarot, and manifestation. Built around your life, <br /> with extreme accuracy.</p>
                <p className="text-md">No appointment. No waiting. Your reading begins now.</p>
            </div>
           
           <div className="flex flex-col gap-3">
                <Button className="bg-[#534AB7] h-auto px-8 py-4 font-heading text-lg animate-pulse-glow">Begin your free reading</Button>
           </div>
            
        </section>
    )
}

export default Hero;