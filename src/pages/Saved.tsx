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
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no`
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

  const handleRemoveCity = (cityName: string) => {
    const updatedCities = savedCities.filter(city => city !== cityName);
    setSavedCities(updatedCities);
    localStorage.setItem("savedCities", JSON.stringify(updatedCities));
    
    // Update weathers state to remove the deleted city
    setWeathers(weathers.filter(w => w.location.name !== cityName));
  };

  if (loading) return <p className="saved-loading">Loading saved cities...</p>;

  if (!savedCities.length) {
    return (
      <div className="saved-page">
        <h1>Saved Locations</h1>
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <h2>No saved locations yet</h2>
          <p>Search for cities on the home page and save them to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h1>Saved Locations</h1>
        <p className="saved-count">{savedCities.length} location{savedCities.length !== 1 ? 's' : ''} saved</p>
      </div>
      <div className="saved-cities">
        {weathers.map((w) => {
          const temperature = unit === 'celsius' ? w.current.temp_c : w.current.temp_f;
          return (
            <div key={w.location.name} className="saved-city-section">
              <div className="city-header">
                <h2 className="city-title">{w.location.name}, {w.location.country}</h2>
                <button 
                  onClick={() => handleRemoveCity(w.location.name)}
                  className="remove-city-button"
                  title="Remove from saved locations"
                >
                  ❌ Remove
                </button>
              </div>
              
              <div className="current-weather-section">
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
                <h3 className="forecast-title">7-Day Forecast</h3>
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
