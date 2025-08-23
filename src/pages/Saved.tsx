import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import { useTemperature } from "../contexts/TemperatureContext";
import "./Saved.css";

interface WeatherData {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    humidity: number;
    wind_kph: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

export default function Saved() {
  const [savedCities, setSavedCities] = useState<string[]>([]);
  const [weathers, setWeathers] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const { unit, getDisplayUnit } = useTemperature();

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
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
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
  }, [savedCities]);

  if (loading) return <p className="saved-loading">Loading saved cities...</p>;

  if (!savedCities.length) return <p className="saved-empty">No saved cities yet.</p>;

  return (
    <div className="saved-page">
      <h1>Saved Cities</h1>
      <div className="saved-grid">
        {weathers.map((w) => {
          const temperature = unit === 'celsius' ? w.current.temp_c : w.current.temp_f;
          return (
            <WeatherCard
              key={w.location.name}
              city={w.location.name}
              temp={Math.round(temperature)}
              humidity={w.current.humidity}
              wind={Math.round(w.current.wind_kph)}
              description={w.current.condition.text}
              icon={w.current.condition.icon}
              unit={getDisplayUnit()}
            />
          );
        })}
      </div>
    </div>
  );
}
