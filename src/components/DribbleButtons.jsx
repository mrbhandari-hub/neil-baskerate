import { useState } from 'react';
import './DribbleButtons.css';

const DRIBBLE_TYPES = [
  { id: 'crossovers', emoji: '🏀🏀', name: 'Crossovers', description: 'Quick side-to-side moves' },
  { id: 'under-legs', emoji: '🏀🦵🦵', name: 'Under the Legs Crossover', description: 'Between the legs crossovers' },
  { id: 'behind-back', emoji: '🏀', name: 'Back Crossovers', description: 'Forward then backward crossovers' },
  { id: 'normal', emoji: '🏀', name: 'Normal Dribble', description: 'Regular dribbling motion' },
];

function DribbleButtons({ onDribbleStart }) {
  const [activeDribble, setActiveDribble] = useState(null);

  const handleDribbleClick = (dribbleType) => {
    if (activeDribble === dribbleType.id) {
      // Stop animation if clicking the same button
      setActiveDribble(null);
      onDribbleStart(null);
    } else {
      setActiveDribble(dribbleType.id);
      onDribbleStart(dribbleType.id);
    }
  };

  return (
    <div className="dribble-buttons-container">
      <h3 className="dribble-section-title">Dribbling Moves</h3>
      <div className="dribble-buttons-grid">
        {DRIBBLE_TYPES.map((dribble) => (
          <button
            key={dribble.id}
            className={`dribble-button ${activeDribble === dribble.id ? 'active' : ''}`}
            onClick={() => handleDribbleClick(dribble)}
            title={dribble.description}
          >
            <span className="dribble-emoji">{dribble.emoji}</span>
            <span className="dribble-name">{dribble.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DribbleButtons;

