import { useState } from 'react'
import './App.css'
import UploadPanel from './components/UploadPanel'
import HeatmapPanel from './components/HeatmapPanel'
import StatsPanel from './components/StatsPanel'

const BASE_URL = "https://ndvi-backend-nxfz.onrender.com";

function App() {
  const [ndviData, setNdviData] = useState(null)
  const [stats, setStats] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [error, setError] = useState(null)

  const handleUpload = async (file) => {
    setError(null)
    setNdviData(null)
    setStats(null)

    const format = file.name.endsWith('.json') ? 'json' : 'csv'

    try {
      const response = await fetch(`${BASE_URL}/upload?format=${format}`, {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setUploadedFile({ name: file.name, size: file.size, status: result.status })
    } catch (err) {
      setError('Failed to upload file: ' + err.message)
    }
  }

  const handleProcess = async () => {
    if (!uploadedFile) return
    setIsProcessing(true)
    setError(null)
    setNdviData(null)
    setStats(null)

    try {
      // Fetch NDVI data (lazily computed on backend)
      const ndviResponse = await fetch(`${BASE_URL}/ndvi`)
      if (!ndviResponse.ok) {
        const errData = await ndviResponse.json()
        throw new Error(errData.error || 'NDVI computation failed')
      }
      const ndviResult = await ndviResponse.json()
      setNdviData(ndviResult.ndvi)

      // Fetch stats (lazily computed via single fold on backend)
      const statsResponse = await fetch(`${BASE_URL}/stats`)
      if (!statsResponse.ok) {
        const errData = await statsResponse.json()
        throw new Error(errData.error || 'Stats computation failed')
      }
      const statsResult = await statsResponse.json()
      setStats(statsResult)
    } catch (err) {
      setError('Processing failed: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="app-container">
      {/* STATIC HEADER — not a navbar */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="header-titles">
            <h1>NDVI Analysis Dashboard</h1>
            <p>Lazy Evaluation using Haskell</p>
          </div>
          <div className="header-badge">
            <span className="header-badge-dot"></span>
            Haskell Backend
          </div>
        </div>
      </header>

      {/* MAIN 3-PANEL LAYOUT */}
      <main className="main-content">
        <div className="dashboard-grid">
          {/* LEFT PANEL — Upload & Process */}
          <UploadPanel
            onUpload={handleUpload}
            onProcess={handleProcess}
            uploadedFile={uploadedFile}
            isProcessing={isProcessing}
            error={error}
          />

          {/* CENTER PANEL — NDVI Heatmap */}
          <HeatmapPanel
            ndviData={ndviData}
            isProcessing={isProcessing}
          />

          {/* RIGHT PANEL — Statistics */}
          <StatsPanel
            stats={stats}
            isProcessing={isProcessing}
          />
        </div>
      </main>
    </div>
  )
}

export default App
