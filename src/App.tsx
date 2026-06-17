import './App.css'
import Navbar from './components/layout/Navbar'
import StarField from './components/layout/StarField'
import ChoosePath from './components/sections/ChoosePath'
import Example from './components/sections/Example'
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import Steps from './components/sections/Steps'

function App() {
  return (
    <>
      <StarField />
      <Navbar />
      <Hero />
      <Marquee />
      <Example />
      <ChoosePath />
      <Steps />
    </>
  )
}

export default App
