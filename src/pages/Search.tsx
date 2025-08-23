import { useState } from "react";
import WeatherCard from "../components/WeatherCard";
import { useTemperature } from "../contexts/TemperatureContext";
import "./Search.css";

interface WeatherData {
  name: string;
  main: { temp: number; humidity: number };
  wind: { speed: number };
  weather: { description: string; icon: string }[];
}

export default function Search() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getApiUnits, getDisplayUnit } = useTemperature();

  const handleSearch = async () => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${getApiUnits()}&appid=${apiKey}`
      );
      if (!res.ok) throw new Error("City not found");

      const data: WeatherData = await res.json();
      setWeather(data);

      // Save city to localStorage
      const stored = localStorage.getItem("savedCities");
      const savedCities = stored ? JSON.parse(stored) : [];
      if (!savedCities.includes(data.name)) {
        savedCities.push(data.name);
        localStorage.setItem("savedCities", JSON.stringify(savedCities));
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
      {weather && (
        <WeatherCard
          city={weather.name}
          temp={Math.round(weather.main.temp)}
          humidity={weather.main.humidity}
          wind={Math.round(weather.wind.speed)}
          description={weather.weather[0].description}
          icon={weather.weather[0].icon}
          unit={getDisplayUnit()}
        />
      )}
    </div>
  );
}
