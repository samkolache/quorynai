import { useEffect } from "react"
import ChoosePath from "../components/sections/ChoosePath"
import Example from "../components/sections/Example"
import Hero from "../components/sections/Hero"
import Marquee from "../components/sections/Marquee"
import Pricing from "../components/sections/Pricing"
import Steps from "../components/sections/Steps"
import { apiFetch } from "@/lib/api"

function Home() {


    return (
        <>
            <Hero />
            <Marquee />
            <Example />
            <ChoosePath />
            <Steps />
            <Pricing />
        </>
    )
}

export default Home
