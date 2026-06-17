import logo from "../../assets/logo.svg"

const footerLinks = [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
]

function Footer() {
    return (
        <footer className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 bg-background/80 backdrop-blur-md border-t border-primary/25 px-6 py-6">
            {/* Brand */}
            <img src={logo} alt="Quoryn Logo" className="h-10 md:justify-self-start" />

            {/* Center links */}
            <ul className="flex flex-wrap justify-center gap-10 items-center">
                {footerLinks.map(({ href, label }) => (
                    <li key={href}>
                        <a href={href} className="text-foreground hover:text-foreground/80 transition-colors">
                            {label}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Disclaimer */}
            <p className="text-sm text-foreground/60 md:justify-self-end">
                For entertainment purposes only.
            </p>
        </footer>
    )
}

export default Footer
