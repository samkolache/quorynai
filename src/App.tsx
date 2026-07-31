import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import UserDetails from './pages/onboarding/UserDetails'
import ChoosePathPage from './pages/onboarding/ChoosePath'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="onboarding/user-details" element={<UserDetails />} />
        <Route path="onboarding/choose-path" element={<ChoosePathPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
