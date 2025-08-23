import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import { useTemperature } from "../contexts/TemperatureContext";
import "./Saved.css";

interface WeatherData {
  name: string;
  main: { temp: number; humidity: number };
  wind: { speed: number };
  weather: { description: string; icon: string }[];
}

export default function Saved() {
  const [savedCities, setSavedCities] = useState<string[]>([]);
  const [weathers, setWeathers] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const { getApiUnits, getDisplayUnit } = useTemperature();

  useEffect(() => {
    const stored = localStorage.getItem("savedCities");
    if (stored) setSavedCities(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
      const results: WeatherData[] = [];

      for (const city of savedCities) {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${getApiUnits()}&appid=${apiKey}`
          );
          if (!res.ok) continue;
          const data: WeatherData = await res.json();
          results.push(data);
        } catch {
          continue;
        }
      }

      setWeathers(results);
      setLoading(false);
    };

    if (savedCities.length) fetchAll();
  }, [savedCities, getApiUnits]);

  if (loading) return <p className="saved-loading">Loading saved cities...</p>;

  if (!savedCities.length) return <p className="saved-empty">No saved cities yet.</p>;

  return (
    <div className="saved-page">
      <h1>Saved Cities</h1>
      <div className="saved-grid">
        {weathers.map((w) => (
          <WeatherCard
            key={w.name}
            city={w.name}
            temp={Math.round(w.main.temp)}
            humidity={w.main.humidity}
            wind={Math.round(w.wind.speed)}
            description={w.weather[0].description}
            icon={w.weather[0].icon}
            unit={getDisplayUnit()}
          />
        ))}
      </div>
    </div>
  );
}
