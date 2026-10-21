import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import StarField from "./StarField"
import Navbar from "./Navbar"
import Footer from "./Footer"

function Layout() {
    const { pathname } = useLocation()

    // Start each page at the top instead of keeping the previous page's scroll position.
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <>
            <StarField />
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout
