import { useRef } from 'react'

export default function UploadPanel({ onUpload, onProcess, uploadedFile, isProcessing, error }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onUpload(file)
    }
  }

  const handleZoneClick = () => {
    fileInputRef.current?.click()
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Data Input</h2>
        <p>Upload CSV or JSON dataset</p>
      </div>
      <div className="panel-body">
        {/* Upload Zone */}
        <div
          className={`upload-zone ${uploadedFile ? 'has-file' : ''}`}
          onClick={handleZoneClick}
        >
          <div className="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h3>{uploadedFile ? 'File Selected' : 'Upload Dataset'}</h3>
          <p>{uploadedFile ? 'Click to change file' : 'CSV or JSON format'}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload-input"
          />
        </div>

        {/* File Info */}
        {uploadedFile && (
          <div className="file-info">
            <div className="file-info-row">
              <span className="file-info-name">{uploadedFile.name}</span>
              <span className="file-info-check">✓</span>
            </div>
            <div className="file-info-row" style={{ marginTop: '4px' }}>
              <span className="file-info-size">{formatSize(uploadedFile.size)}</span>
              <span className="file-info-size">Uploaded</span>
            </div>
          </div>
        )}

        {/* Process Button */}
        <button
          className={`btn-process ${isProcessing ? 'loading' : ''}`}
          onClick={onProcess}
          disabled={!uploadedFile || isProcessing}
          id="process-button"
        >
          {isProcessing ? (
            <>
              <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span>
              Processing NDVI...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Process Dataset
            </>
          )}
        </button>

        {/* Status Messages */}
        {error && (
          <div className="upload-status error">{error}</div>
        )}
        {uploadedFile && !error && !isProcessing && (
          <div className="upload-status success">
            Dataset ready for processing
          </div>
        )}
      </div>
    </div>
  )
}
