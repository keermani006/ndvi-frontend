import { useEffect, useRef, useState } from 'react'

function getColor(val) {
  if (val < 0) return "#ef4444";
  if (val < 0.2) return "#eab308";
  return "#22c55e";
}

export default function HeatmapPanel({ ndviData: data, isProcessing }) {
  const canvasRef = useRef(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null })

  useEffect(() => {
    console.log("NDVI DATA:", data);

    if (!data || data.length === 0 || !data[0]) return;

    const renderCanvas = () => {
      const canvas = canvasRef.current;
      
      // If canvas is null, it means it is still hidden behind isProcessing true 
      // wait slightly for the DOM to add the canvas and try again
      if (!canvas) {
        setTimeout(renderCanvas, 50);
        return;
      }

      const ctx = canvas.getContext("2d");

      canvas.width = 500;
      canvas.height = 400;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rows = data.length;
      const cols = data[0].length;

      const cellWidth = canvas.width / cols;
      const cellHeight = canvas.height / rows;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const val = data[i][j];
          ctx.fillStyle = getColor(val);
          ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
          
          // Draw grid border lines
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        }
      }
    };

    renderCanvas();

  }, [data]);

  const handleMouseMove = (e) => {
    if (!data || data.length === 0 || !data[0]) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const rows = data.length;
    const cols = data[0].length;
    
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    const j = Math.floor(mouseX / cellWidth);
    const i = Math.floor(mouseY / cellHeight);

    if (i >= 0 && i < rows && j >= 0 && j < cols) {
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        value: data[i][j]
      });
    } else {
      setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>NDVI Visualization</h2>
        <p>Heatmap grid with discrete colors</p>
      </div>

      <div className="panel-body">
        {isProcessing ? (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <p>Processing NDVI...</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Haskell backend computing lazily...
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <div className="heatmap-container">
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              Grid Size: {data.length} &times; {data[0].length}
            </p>

            <div className="heatmap-canvas-wrapper">
              <canvas 
                ref={canvasRef} 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'crosshair' }}
              />
            </div>

            <div className="color-legend">
              <div
                className="color-legend-bar"
                style={{
                  background:
                    "linear-gradient(to right, #ef4444 33%, #eab308 33% 66%, #22c55e 66%)",
                }}
              ></div>
              <div className="color-legend-labels">
                <span>&lt; 0 (Red)</span>
                <span>0.0 - 0.2 (Yellow)</span>
                <span>&gt; 0.2 (Green)</span>
              </div>
            </div>

            {tooltip.visible && tooltip.value !== null && (
              <div style={{
                position: 'fixed',
                left: tooltip.x + 15,
                top: tooltip.y + 15,
                background: 'rgba(17, 24, 39, 0.95)',
                color: '#fff',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '500',
                pointerEvents: 'none',
                zIndex: 9999,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap'
              }}>
                NDVI: {tooltip.value.toFixed(4)}
              </div>
            )}
          </div>
        ) : (
          <div className="no-data-placeholder">
            <p>No data to display</p>
          </div>
        )}
      </div>
    </div>
  )
}