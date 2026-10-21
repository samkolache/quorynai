import './App.css'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Pricing from './pages/Pricing'
import Onboarding from './pages/Onboarding'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Blog from './pages/Blog'

const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'))
const Overview = lazy(() => import('./pages/dashboard/Overview'))
const Astrology = lazy(() => import('./pages/dashboard/Astrology'))
const Tarot = lazy(() => import('./pages/dashboard/Tarot'))
const Manifestation = lazy(() => import('./pages/dashboard/Manifestation'))
const Psychic = lazy(() => import('./pages/dashboard/Psychic'))
const Account = lazy(() => import('./pages/dashboard/Account'))
const Compatibility = lazy(() => import('./pages/dashboard/Compatibility'))
const FirstReading = lazy(() => import('./pages/FirstReading'))

function App() {
  return (
    <BrowserRouter>
      {/* The dashboard and first reading load on demand, keeping the marketing pages fast. */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="blog" element={<Blog />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="reading" element={<FirstReading />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<SignIn />} />
          </Route>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="astrology" element={<Astrology />} />
            <Route path="tarot" element={<Tarot />} />
            <Route path="manifestation" element={<Manifestation />} />
            <Route path="psychic" element={<Psychic />} />
            <Route path="compatibility" element={<Compatibility />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
