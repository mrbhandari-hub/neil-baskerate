import './ClearButton.css';

function ClearButton({ onClear }) {
  return (
    <button className="clear-button" onClick={onClear}>
      <span className="clear-icon">🗑️</span>
      <span className="clear-text">Clear All</span>
    </button>
  );
}

export default ClearButton;

