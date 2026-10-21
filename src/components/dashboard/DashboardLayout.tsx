import { useEffect, useState } from "react"
import { Link, NavLink, useLocation, useNavigate, useOutlet } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { Download, LayoutGrid, LogOut, MoreHorizontal, UserRound } from "lucide-react"
import StarField from "@/components/layout/StarField"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useInstallPrompt } from "@/hooks/useInstallPrompt"
import { signOut } from "@/lib/account"
import { cn } from "@/lib/utils"
import logo from "@/assets/logo.svg"
import { CATEGORIES } from "./categories"

const navItems = [
    { path: "/dashboard", label: "Overview", shortLabel: "Home", icon: <LayoutGrid className="size-4" />, end: true },
    ...CATEGORIES.map((c) => ({ path: c.path, label: c.label, shortLabel: c.shortLabel, icon: c.icon, end: false })),
    { path: "/dashboard/account", label: "Account", shortLabel: "Account", icon: <UserRound className="size-4" />, end: false },
]

// The phone bar has room for five; the rest live behind "More".
const BAR_COUNT = 5
const barItems = navItems.slice(0, BAR_COUNT)
const moreItems = navItems.slice(BAR_COUNT)

function DashboardLayout() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const outlet = useOutlet()
    const install = useInstallPrompt()
    const [moreOpen, setMoreOpen] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    function handleSignOut() {
        signOut()
        navigate("/")
    }

    const moreActive = moreItems.some((item) => pathname.startsWith(item.path))

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <StarField />

            {/* Desktop sidebar */}
            <aside className="sticky top-0 z-40 hidden h-screen w-64 shrink-0 flex-col border-r border-primary/25 bg-background/80 backdrop-blur-md md:flex">
                <Link to="/" className="flex items-center px-6 pt-6 pb-8">
                    <img src={logo} alt="Quoryn Logo" className="h-9" />
                </Link>

                <nav className="flex flex-1 flex-col gap-1 px-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                cn(
                                    "relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm whitespace-nowrap transition-colors",
                                    isActive ? "text-foreground" : "text-foreground/65 hover:bg-primary/10 hover:text-foreground",
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.span
                                            layoutId="sidebar-active"
                                            className="absolute inset-0 rounded-lg bg-primary/25 shadow-[inset_0_0_0_1px_rgba(83,74,183,0.6)]"
                                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                        />
                                    )}
                                    <span className="relative text-accent">{item.icon}</span>
                                    <span className="relative">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex flex-col gap-1 p-3">
                    {install && (
                        <button
                            type="button"
                            onClick={install}
                            className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-primary/20"
                        >
                            <Download className="size-4 text-accent" /> Install app
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-foreground/55 transition-colors hover:bg-primary/10 hover:text-foreground"
                    >
                        <LogOut className="size-4" /> Sign out
                    </button>
                </div>
            </aside>

            {/* Phone header */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-primary/25 bg-background/80 px-5 py-3 backdrop-blur-md md:hidden">
                <Link to="/">
                    <img src={logo} alt="Quoryn Logo" className="h-8" />
                </Link>
                {install && (
                    <button type="button" onClick={install} className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs">
                        <Download className="size-3.5 text-accent" /> Install
                    </button>
                )}
            </header>

            <main className="min-w-0 flex-1 px-5 pt-8 pb-28 md:px-10 md:py-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {outlet}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Phone bottom bar, within thumb reach */}
            <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-primary/25 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
                {barItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            cn("flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.7rem] transition-colors", isActive ? "text-accent" : "text-foreground/55")
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={cn("flex h-7 w-12 items-center justify-center rounded-full transition-colors", isActive && "bg-primary/25")}>{item.icon}</span>
                                {item.shortLabel}
                            </>
                        )}
                    </NavLink>
                ))}
                <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                    <SheetTrigger
                        className={cn("flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.7rem] transition-colors", moreActive ? "text-accent" : "text-foreground/55")}
                    >
                        <span className={cn("flex h-7 w-12 items-center justify-center rounded-full", moreActive && "bg-primary/25")}>
                            <MoreHorizontal className="size-4" />
                        </span>
                        More
                    </SheetTrigger>
                    <SheetContent side="bottom" className="gap-1 rounded-t-2xl border-primary/30 bg-[#0f0a1f]/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-md">
                        <SheetTitle className="px-2 pb-2 font-heading text-xl font-light">More</SheetTitle>
                        {moreItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMoreOpen(false)}
                                className={({ isActive }) =>
                                    cn("flex items-center gap-3 rounded-lg px-4 py-3 text-base", isActive ? "bg-primary/25 text-foreground" : "text-foreground/75")
                                }
                            >
                                <span className="text-accent">{item.icon}</span> {item.label}
                            </NavLink>
                        ))}
                        <button type="button" onClick={handleSignOut} className="flex items-center gap-3 rounded-lg px-4 py-3 text-base text-foreground/55">
                            <LogOut className="size-4" /> Sign out
                        </button>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    )
}

export default DashboardLayout
