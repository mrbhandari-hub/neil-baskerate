import './FinishButton.css';

function FinishButton({ onFinish }) {
  return (
    <button className="finish-button" onClick={onFinish}>
      <span className="finish-icon">✅</span>
      <span className="finish-text">Finish</span>
    </button>
  );
}

export default FinishButton;

