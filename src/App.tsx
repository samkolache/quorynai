import './App.css'
import Navbar from './components/layout/Navbar'
import StarField from './components/layout/StarField'
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'

function App() {
  return (
    <>
      <StarField />
      <Navbar />
      <Hero />
      <Marquee />
    </>
  )
}

export default App
