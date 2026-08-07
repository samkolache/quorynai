function Marquee() {
    
    const marqueeStatements = [
        "Specific to your situation, not a generalization",
        "What you share stays between you and Quoryn",
        "Built different from every astrology app you've tried",
        "Four spiritual frameworks, one conversation",
        "Ancient wisdom, modern intelligence",
        "Powered by the same technology behind the world's leading platforms",
    ]
    
    
    
    
    return (
        <section className="py-12 md:py-24 text-center flex flex-col gap-6">
            <p className="uppercase tracking-[0.3em] text-xs px-6 md:px-0">Our readers say Quoryn knows things it shouldn't.</p>
            <div className=" py-4 md:py-6 lg:py-8 bg-background/80 backdrop-blur-md text-center">
            <div className="overflow-hidden">
                <div className="flex w-max gap-12 whitespace-nowrap animate-marquee">
                    {[...marqueeStatements, ...marqueeStatements].map((statement, i) => (
                        <p key={i} className="flex items-center gap-12 text-sm md:text-base">
                            {statement}
                            <span className="text-primary">·</span>
                        </p>
                    ))}
                </div>
            </div>
        </div>
        </section>
        
    )
}

export default Marquee