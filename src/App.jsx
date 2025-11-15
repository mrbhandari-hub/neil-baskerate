import { useState, useRef } from 'react';
import BasketballCanvas from './components/BasketballCanvas';
import ColorPicker from './components/ColorPicker';
import PenToolSelector from './components/PenToolSelector';
import GlitterToggle from './components/GlitterToggle';
import SaveButton from './components/SaveButton';
import ClearButton from './components/ClearButton';
import './App.css';

function App() {
  const [selectedColor, setSelectedColor] = useState('#FF0000'); // Red default
  const [selectedTool, setSelectedTool] = useState('dots');
  const [isGlitterEnabled, setIsGlitterEnabled] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);
  const canvasRef = useRef(null);

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Check if Web Share API is available (iOS/Safari/modern browsers)
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], 'Rahul Bhandari.png', { type: 'image/png' });
          
          // Check if we can share files
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: 'My Basketball Design',
                text: 'Check out my decorated basketball!'
              });
              return;
            } catch (err) {
              // User cancelled share or error occurred
              console.log('Share cancelled or failed:', err);
            }
          }
        }

        // Fallback: traditional download for desktop browsers
        const link = document.createElement('a');
        link.download = 'Rahul Bhandari.png';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }, 'image/png');
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the basketball base
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF8C00';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw characteristic basketball lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.stroke();

    // Curved lines
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Trigger the canvas component to clear its drawing history
    setClearTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏀 Basketball Decorator</h1>
        <p>Decorate your basketball with colors, patterns, and glitter!</p>
      </header>
      
      <div className="app-container">
        <div className="sidebar">
          <ColorPicker 
            selectedColor={selectedColor} 
            onColorChange={setSelectedColor} 
          />
          <PenToolSelector 
            selectedTool={selectedTool} 
            onToolChange={setSelectedTool} 
          />
        </div>
        
        <div className="main-content">
          <BasketballCanvas
            canvasRef={canvasRef}
            selectedColor={selectedColor}
            selectedTool={selectedTool}
            isGlitterEnabled={isGlitterEnabled}
            clearTrigger={clearTrigger}
          />
          
          <div className="toolbar">
            <GlitterToggle 
              isGlitterEnabled={isGlitterEnabled}
              onToggle={() => setIsGlitterEnabled(!isGlitterEnabled)}
            />
            <ClearButton onClear={handleClear} />
            <SaveButton onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
