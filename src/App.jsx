import { useState, useRef } from 'react';
import BasketballCanvas from './components/BasketballCanvas';
import ColorPicker from './components/ColorPicker';
import PenToolSelector from './components/PenToolSelector';
import GlitterToggle from './components/GlitterToggle';
import SaveButton from './components/SaveButton';
import './App.css';

function App() {
  const [selectedColor, setSelectedColor] = useState('#FF0000'); // Red default
  const [selectedTool, setSelectedTool] = useState('dots');
  const [isGlitterEnabled, setIsGlitterEnabled] = useState(false);
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
          />
          
          <div className="toolbar">
            <GlitterToggle 
              isGlitterEnabled={isGlitterEnabled}
              onToggle={() => setIsGlitterEnabled(!isGlitterEnabled)}
            />
            <SaveButton onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
