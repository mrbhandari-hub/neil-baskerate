import './GlitterToggle.css';

function GlitterToggle({ isGlitterEnabled, onToggle }) {
  return (
    <button
      className={`glitter-toggle ${isGlitterEnabled ? 'active' : ''}`}
      onClick={onToggle}
      title="Toggle Glitter Effect"
    >
      <span className="glitter-emoji">✨</span>
      <span className="glitter-text">
        {isGlitterEnabled ? 'Glitter ON' : 'Glitter OFF'}
      </span>
    </button>
  );
}

export default GlitterToggle;

