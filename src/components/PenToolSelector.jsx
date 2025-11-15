import './PenToolSelector.css';

const tools = [
  { id: 'dots', name: 'Dots', emoji: '⚫️' },
  { id: 'squiggly', name: 'Squiggly', emoji: '〰️' },
  { id: 'straight', name: 'Straight Lines', emoji: '📏' },
  { id: 'thick', name: 'Thick', emoji: '🖌️' },
  { id: 'mountain', name: 'Mountain Lines', emoji: '⛰️' },
];

function PenToolSelector({ selectedTool, onToolChange }) {
  return (
    <div className="pen-tool-selector">
      <h3>Pen Tools</h3>
      <div className="tool-grid">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolChange(tool.id)}
            title={tool.name}
          >
            <span className="tool-emoji">{tool.emoji}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PenToolSelector;

