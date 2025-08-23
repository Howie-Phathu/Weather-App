import { useTemperature } from '../contexts/TemperatureContext';
import './TemperatureToggle.css';

export default function TemperatureToggle() {
  const { unit, toggleUnit } = useTemperature();

  return (
    <div className="temperature-toggle">
      <button 
        className={`toggle-btn ${unit === 'celsius' ? 'active' : ''}`}
        onClick={toggleUnit}
      >
        °C
      </button>
      <button 
        className={`toggle-btn ${unit === 'fahrenheit' ? 'active' : ''}`}
        onClick={toggleUnit}
      >
        °F
      </button>
    </div>
  );
}
