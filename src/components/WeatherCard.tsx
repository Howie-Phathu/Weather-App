import "./WeatherCard.css";

interface Props {
  city: string;
  temp: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
  unit: string;
}

export default function WeatherCard({
  city,
  temp,
  humidity,
  wind,
  description,
  icon,
  unit,
}: Props) {
  return (
    <div className="weather-card">
      <h2 className="weather-city">{city}</h2>
      <p className="weather-description">{description}</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="weather icon"
        className="weather-icon"
      />
      <p className="weather-temp">{temp}{unit}</p>
      <p className="weather-humidity">Humidity: {humidity}%</p>
      <p className="weather-wind">Wind: {wind}</p>
    </div>
  );
}
