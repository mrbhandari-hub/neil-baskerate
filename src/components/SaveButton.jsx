import './SaveButton.css';

function SaveButton({ onSave }) {
  return (
    <button className="save-button" onClick={onSave}>
      <span className="save-icon">📤</span>
      <span className="save-text">Share</span>
    </button>
  );
}

export default SaveButton;

