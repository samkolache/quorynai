import logo from "@/assets/logo.svg"

// Small brand line inside shareable cards, so shared images carry the Quoryn name.
function ShareFooter() {
    return (
        <div className="flex items-center justify-between gap-3 border-t border-primary/15 pt-3">
            <img src={logo} alt="Quoryn" className="h-5 opacity-80" />
            <span className="font-heading text-sm italic text-foreground/50">Read your sky with Quoryn</span>
        </div>
    )
}

export default ShareFooter
