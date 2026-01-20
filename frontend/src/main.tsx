import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Context Provider'ları import et
import { ZoneProvider } from './context/ZoneContext'
import { SimulationProvider } from './context/SimulationContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Uygulamayı Yöneticilerle Sarmalıyoruz */}
    <ZoneProvider>
      <SimulationProvider>
        <App />
      </SimulationProvider>
    </ZoneProvider>
  </React.StrictMode>,
)