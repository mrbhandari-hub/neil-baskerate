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

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.download = 'Rahul Bhandari.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
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
