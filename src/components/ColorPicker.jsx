import './ColorPicker.css';

const colors = [
  { name: 'Red', value: '#FF0000', emoji: '🔴' },
  { name: 'Orange', value: '#FFA500', emoji: '🟠' },
  { name: 'Yellow', value: '#FFFF00', emoji: '🟡' },
  { name: 'Green', value: '#00FF00', emoji: '🟢' },
  { name: 'Blue', value: '#0000FF', emoji: '🔵' },
  { name: 'Purple', value: '#800080', emoji: '🟣' },
  { name: 'Pink', value: '#FFC0CB', emoji: '🩷' },
  { name: 'Gray', value: '#808080', emoji: '🩶' },
  { name: 'Black', value: '#000000', emoji: '⚫️' },
  { name: 'White', value: '#FFFFFF', emoji: '⚪️' },
];

function ColorPicker({ selectedColor, onColorChange }) {
  return (
    <div className="color-picker">
      <h3>Colors</h3>
      <div className="color-grid">
        {colors.map((color) => (
          <button
            key={color.name}
            className={`color-button ${selectedColor === color.value ? 'active' : ''}`}
            onClick={() => onColorChange(color.value)}
            style={{ backgroundColor: color.value }}
            title={color.name}
          >
            <span className="color-emoji">{color.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;

