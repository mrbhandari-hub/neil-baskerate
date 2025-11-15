import './SaveButton.css';

function SaveButton({ onSave }) {
  // Detect if on mobile/iOS for better button text
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  return (
    <button className="save-button" onClick={onSave}>
      <span className="save-icon">{isMobile ? '📤' : '💾'}</span>
      <span className="save-text">{isMobile ? 'Share' : 'Save as "Rahul Bhandari"'}</span>
    </button>
  );
}

export default SaveButton;

