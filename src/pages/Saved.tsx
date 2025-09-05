import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
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
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avghumidity: number;
        maxwind_kph: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
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
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no`
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
      <div className="saved-cities">
        {weathers.map((w) => {
          const temperature = unit === 'celsius' ? w.current.temp_c : w.current.temp_f;
          return (
            <div key={w.location.name} className="saved-city-section">
              <div className="current-weather-section">
                <h2 className="section-title">{w.location.name}</h2>
                <WeatherCard
                  city={w.location.name}
                  temp={Math.round(temperature)}
                  humidity={w.current.humidity}
                  wind={Math.round(w.current.wind_kph)}
                  description={w.current.condition.text}
                  icon={w.current.condition.icon}
                  unit={getDisplayUnit()}
                />
              </div>

              <div className="forecast-section">
                <h3 className="forecast-title">3-Day Forecast</h3>
                <div className="forecast-grid">
                  {w.forecast.forecastday.map((day, index) => (
                    <ForecastCard
                      key={index}
                      date={day.date}
                      maxTemp={Math.round(unit === 'celsius' ? day.day.maxtemp_c : day.day.maxtemp_f)}
                      minTemp={Math.round(unit === 'celsius' ? day.day.mintemp_c : day.day.mintemp_f)}
                      humidity={day.day.avghumidity}
                      wind={Math.round(day.day.maxwind_kph)}
                      description={day.day.condition.text}
                      icon={day.day.condition.icon}
                      unit={getDisplayUnit()}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
