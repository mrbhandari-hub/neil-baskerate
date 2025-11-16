import { useState } from 'react';
import './HoopColorPicker.css';

const HOOP_COLORS = [
  { name: 'Orange', value: '#FF8800' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0066FF' },
  { name: 'Green', value: '#00AA00' },
  { name: 'Purple', value: '#AA00AA' },
  { name: 'Yellow', value: '#FFDD00' },
  { name: 'Pink', value: '#FF66CC' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Gold', value: '#FFD700' },
];

function HoopColorPicker({ selectedColor, onColorChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hoop-color-picker-container">
      <button 
        className="hoop-color-picker-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="hoop-color-icon">🏀</span>
        <span className="hoop-color-text">Hoop Color</span>
        <span 
          className="hoop-color-preview" 
          style={{ backgroundColor: selectedColor }}
        ></span>
      </button>
      
      {isOpen && (
        <div className="hoop-color-picker-menu">
          <div className="hoop-color-grid">
            {HOOP_COLORS.map((color) => (
              <button
                key={color.value}
                className={`hoop-color-option ${selectedColor === color.value ? 'selected' : ''}`}
                onClick={() => {
                  onColorChange(color.value);
                  setIsOpen(false);
                }}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {selectedColor === color.value && <span className="checkmark">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HoopColorPicker;

