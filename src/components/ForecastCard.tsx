import "./ForecastCard.css";

interface Props {
  date: string;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
  unit: string;
}

export default function ForecastCard({
  date,
  maxTemp,
  minTemp,
  humidity,
  wind,
  description,
  icon,
  unit,
}: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="forecast-card">
      <h3 className="forecast-date">{formatDate(date)}</h3>
      <img
        src={icon}
        alt="weather icon"
        className="forecast-icon"
      />
      <p className="forecast-description">{description}</p>
      <div className="forecast-temps">
        <span className="forecast-max">{maxTemp}°{unit}</span>
        <span className="forecast-min">{minTemp}°{unit}</span>
      </div>
      <div className="forecast-details">
        <p className="forecast-humidity">Humidity: {humidity}%</p>
        <p className="forecast-wind">Wind: {wind} km/h</p>
      </div>
    </div>
  );
}
