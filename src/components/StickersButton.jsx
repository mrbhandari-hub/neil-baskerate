import { useState } from 'react';
import './StickersButton.css';

const STICKERS = [
  { emoji: '⭐', name: 'Star' },
  { emoji: '❤️', name: 'Heart' },
  { emoji: '🔥', name: 'Fire' },
  { emoji: '💪', name: 'Muscle' },
  { emoji: '👑', name: 'Crown' },
  { emoji: '⚡', name: 'Lightning' },
  { emoji: '🎯', name: 'Target' },
  { emoji: '🏆', name: 'Trophy' },
  { emoji: '💎', name: 'Diamond' },
  { emoji: '🌟', name: 'Glowing Star' },
];

function StickersButton({ onStickerSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState(null);

  const handleStickerClick = (sticker) => {
    setSelectedSticker(sticker);
    setIsOpen(false);
    onStickerSelect(sticker);
  };

  return (
    <div className="stickers-button-container">
      <button 
        className={`stickers-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="stickers-icon">🎨</span>
        <span className="stickers-text">
          {selectedSticker ? `Sticker: ${selectedSticker.emoji}` : 'Add Sticker'}
        </span>
      </button>
      
      {isOpen && (
        <div className="stickers-picker">
          <div className="stickers-grid">
            {STICKERS.map((sticker, index) => (
              <button
                key={index}
                className="sticker-option"
                onClick={() => handleStickerClick(sticker)}
                title={sticker.name}
              >
                <span className="sticker-emoji">{sticker.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StickersButton;

