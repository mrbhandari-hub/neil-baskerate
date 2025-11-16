import { useState } from 'react';
import './PersonColorPicker.css';

const PERSON_COLORS = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0066FF' },
  { name: 'Green', value: '#00AA00' },
  { name: 'Purple', value: '#AA00AA' },
  { name: 'Orange', value: '#FF8800' },
  { name: 'Yellow', value: '#FFDD00' },
  { name: 'Pink', value: '#FF66CC' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Brown', value: '#8B4513' },
];

function PersonColorPicker({ selectedColor, onColorChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="person-color-picker-container">
      <button 
        className="person-color-picker-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: selectedColor }}
      >
        <span className="person-color-icon">👤</span>
        <span className="person-color-text">Person Color</span>
      </button>
      
      {isOpen && (
        <div className="person-color-picker-menu">
          <div className="person-color-grid">
            {PERSON_COLORS.map((color) => (
              <button
                key={color.value}
                className={`person-color-option ${selectedColor === color.value ? 'selected' : ''}`}
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

export default PersonColorPicker;

