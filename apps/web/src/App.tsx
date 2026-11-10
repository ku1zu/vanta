import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QualityProvider } from '@vanta/stage'
import { Shell } from './app/Shell'
import Landing from './pages/Landing'
import Demo from './pages/Demo'
import { Login, Signup } from './pages/Auth'
import Pricing from './pages/Pricing'
import Lab from './pages/Lab'
import { OSShell } from './os/components/OSShell'
import Overview from './os/pages/Overview'
import Section from './os/pages/Section'
import Websites from './os/pages/Websites'
import Intelligence from './os/pages/Intelligence'
import { IntelligenceProvider } from './os/intelligence/IntelligenceContext'
import HQLab from './hq-lab/HQLab'

export default function App() {
  const lab = new URLSearchParams(location.search).has('lab') // /?lab opens the Material Lab
  return (
    <QualityProvider>
      {lab ? <Lab /> : (
        <BrowserRouter>
          <Routes>
            <Route path="/hq-lab" element={<HQLab />} />
            <Route element={<Shell />}>
              <Route index element={<Landing />} />
              <Route path="demo" element={<Demo />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="os" element={<IntelligenceProvider><OSShell /></IntelligenceProvider>}>
                <Route index element={<Overview />} />
                <Route path="intelligence" element={<Intelligence />} />
                <Route path="websites" element={<Websites />} />
                <Route path=":section" element={<Section />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </QualityProvider>
  )
}