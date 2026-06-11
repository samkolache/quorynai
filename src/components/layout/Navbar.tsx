import { Collapsible } from "@base-ui/react/collapsible"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/button"
import logo from "../../assets/logo.svg"

const navLinks = [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
]

function Navbar() {
    return (
        <Collapsible.Root className="group">
            <nav className="flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] bg-background/80 backdrop-blur-md border-b border-primary/25 px-6 py-3">
                {/* Brand */}
                <img src={logo} alt="Quoryn Logo" className="h-10 md:justify-self-start" />

                {/* Desktop nav links */}
                <ul className="hidden md:flex gap-10 items-center">
                    {navLinks.map(({ href, label }) => (
                        <li key={href}>
                            <a href={href} className="text-foreground hover:text-foreground/80 transition-colors">
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Desktop buttons */}
                <div className="hidden md:flex items-center gap-4 md:justify-self-end">
                    <Button variant="outline">Sign in</Button>
                    <Button>Get Started</Button>
                </div>

                {/* Mobile hamburger trigger */}
                <Collapsible.Trigger
                    render={<Button variant="outline" size="icon" className="md:hidden" />}
                >
                    <Menu className="group-data-open:hidden" />
                    <X className="hidden group-data-open:block" />
                </Collapsible.Trigger>
            </nav>

            {/* Mobile dropdown panel */}
            <Collapsible.Panel className="md:hidden overflow-hidden data-[open]:animate-slide-down data-[closed]:animate-slide-up">
                <div className="flex flex-col gap-4 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-primary/25">
                    <ul className="flex flex-col gap-3">
                        {navLinks.map(({ href, label }) => (
                            <li key={href}>
                                <a href={href} className="text-foreground hover:text-foreground/80 transition-colors">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" className="w-full">Sign in</Button>
                        <Button className="w-full">Get Started</Button>
                    </div>
                </div>
            </Collapsible.Panel>
        </Collapsible.Root>
    )
}

export default Navbar
