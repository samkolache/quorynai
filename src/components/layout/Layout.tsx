import { Outlet } from "react-router-dom"
import StarField from "./StarField"
import Navbar from "./Navbar"
import Footer from "./Footer"

function Layout() {
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
