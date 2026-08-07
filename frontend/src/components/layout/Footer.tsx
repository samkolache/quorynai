import { Link } from "react-router-dom"
import logo from "../../assets/logo.svg"

const footerLinks = [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
]

function Footer() {
    return (
        <footer className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center justify-items-center md:justify-items-stretch gap-6 bg-background/80 backdrop-blur-md border-t border-primary/25 px-6 py-3">
            {/* Brand */}
            <Link to="/" className="md:justify-self-start">
                <img src={logo} alt="Quoryn Logo" className="h-8 md:h-10" />
            </Link>

            {/* Center links */}
            <ul className="flex flex-wrap justify-center gap-10 items-center">
                {footerLinks.map(({ href, label }) => (
                    <li key={href}>
                        <Link to={href} className="text-foreground hover:text-foreground/80 transition-colors">
                            {label}
                        </Link>
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
