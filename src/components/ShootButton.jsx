import './ShootButton.css';

function ShootButton({ onShoot }) {
  return (
    <button className="shoot-button" onClick={onShoot}>
      <span className="shoot-icon">☄️</span>
      <span className="shoot-text">Shoot!</span>
    </button>
  );
}

export default ShootButton;

