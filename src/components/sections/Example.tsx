import { Check } from "lucide-react";
import { Button } from "../ui/button";



function Example() {

    const coolThings = [
        "The only psychic app that understands what you're going through emotionally, not just astrologically.",
        "A two-way conversation that actually listens.",
        "Choose your path: astrology, tarot, manifestation, or psychic reading."
    ]


    return (
            <section className="grid grid-cols-1 md:grid-cols-2 items-start max-w-6xl mx-auto gap-12 py-12 md:py-24 px-6">
                <div className="flex flex-col gap-8">
                <h2 className="text-[clamp(1.875rem,5vw,3rem)] font-light">Not your typical horoscope app.</h2>
                <div className="flex flex-col gap-5">
                    {coolThings.map((coolItem, i) => (
                        <div key={i} className="flex gap-3">   
                             <Check className="text-primary text-xl" />
                            <p className="text-sm md:text-base">{coolItem}</p>
                        </div>
                    ))}
                </div>
                <Button size="cta" className=" self-start md:self-center">Start your reading</Button>
                </div>
                <img src="/example.png" alt="Quoryn conversation example" className="w-full md:w-[500px] shrink-0 rounded-xl" />
            </section>
    )
}

export default Example;
