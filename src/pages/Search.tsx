import { useState } from "react";
import WeatherCard from "../components/WeatherCard";
import { useTemperature } from "../contexts/TemperatureContext";
import "./Search.css";

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

export default function Search() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { unit, getDisplayUnit } = useTemperature();

  const handleSearch = async () => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
      );
      if (!res.ok) throw new Error("City not found");

      const data: WeatherData = await res.json();
      setWeather(data);

      // Save city to localStorage
      const stored = localStorage.getItem("savedCities");
      const savedCities = stored ? JSON.parse(stored) : [];
      if (!savedCities.includes(data.location.name)) {
        savedCities.push(data.location.name);
        localStorage.setItem("savedCities", JSON.stringify(savedCities));
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!weather) {
    return (
      <div className="search-page">
        <h1>Search City</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="search-error">{error}</p>}
      </div>
    );
  }

  const temperature = unit === 'celsius' ? weather.current.temp_c : weather.current.temp_f;

  return (
    <div className="search-page">
      <h1>Search City</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="search-error">{error}</p>}
      <WeatherCard
        city={weather.location.name}
        temp={Math.round(temperature)}
        humidity={weather.current.humidity}
        wind={Math.round(weather.current.wind_kph)}
        description={weather.current.condition.text}
        icon={weather.current.condition.icon}
        unit={getDisplayUnit()}
      />
    </div>
  );
}
