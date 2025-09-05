import {useEffect, useState} from 'react';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import TemperatureGraph from '../components/TemperatureGraph';
import { useTemperature } from '../contexts/TemperatureContext';
import "./Home.css";

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

export default function Home() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchCity, setSearchCity] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const { unit, getDisplayUnit } = useTemperature();

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

                try {
                    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data: WeatherData = await response.json();
                    setWeatherData(data);
                    checkIfSaved(data.location.name);
                } catch (error: any) {
                    setError(`Error fetching weather data: ${error.message}`);
                }
            },
            (error) => {
                setError(`Geolocation error: ${error.message}`);
            }
        );
    }, []);

    const handleSearch = async () => {
        if (!searchCity.trim()) return;
        
        setIsSearching(true);
        setError(null);
        const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchCity}&days=7&aqi=no`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data: WeatherData = await response.json();
            setWeatherData(data);
            checkIfSaved(data.location.name);
        } catch (error: any) {
            setError(`Error fetching weather data: ${error.message}`);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const checkIfSaved = (cityName: string) => {
        const stored = localStorage.getItem("savedCities");
        const savedCities = stored ? JSON.parse(stored) : [];
        setIsSaved(savedCities.includes(cityName));
    };

    const handleSaveLocation = () => {
        if (!weatherData) return;
        
        const cityName = weatherData.location.name;
        const stored = localStorage.getItem("savedCities");
        const savedCities = stored ? JSON.parse(stored) : [];
        
        if (!savedCities.includes(cityName)) {
            savedCities.push(cityName);
            localStorage.setItem("savedCities", JSON.stringify(savedCities));
            setIsSaved(true);
        }
    };

    const handleRemoveLocation = () => {
        if (!weatherData) return;
        
        const cityName = weatherData.location.name;
        const stored = localStorage.getItem("savedCities");
        const savedCities = stored ? JSON.parse(stored) : [];
        
        const updatedCities = savedCities.filter((city: string) => city !== cityName);
        localStorage.setItem("savedCities", JSON.stringify(updatedCities));
        setIsSaved(false);
    };

    return(
        <div className="home-page">
            <div className="search-section">
                <h1 className="page-title">Weather Forecast</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for a city..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="search-input"
                    />
                    <button 
                        onClick={handleSearch} 
                        disabled={isSearching || !searchCity.trim()}
                        className="search-button"
                    >
                        {isSearching ? "Searching..." : "Search"}
                    </button>
                </div>
            </div>

            {!weatherData && !error && (
                <div className="hero-section">
                    <h1 className="hero-title">Welcome to WeatherApp</h1>
                    <p className="hero-subtitle">
                        Your personal weather companion that allows you to see your current location's weather 
                        as well as any other location you search for around the world.
                    </p>
                    <div className="hero-features">
                        <div className="feature-item">
                            <span className="feature-icon">📍</span>
                            <span>Current Location Weather</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🔍</span>
                            <span>Search Any City</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📅</span>
                            <span>7-Day Forecast</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📊</span>
                            <span>Temperature Graph</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🌡️</span>
                            <span>Celsius/Fahrenheit Toggle</span>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <p className="error-hint">Try refreshing the page or check your internet connection.</p>
                </div>
            )}

            {weatherData && (
                <div className="weather-content">
                    <div className="current-weather-section">
                        <div className="weather-header">
                            <h2 className="section-title">Current Weather - {weatherData.location.name}</h2>
                            <div className="save-button-container">
                                {isSaved ? (
                                    <button 
                                        onClick={handleRemoveLocation}
                                        className="remove-button"
                                        title="Remove from saved locations"
                                    >
                                        ❤️ Saved
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleSaveLocation}
                                        className="save-button"
                                        title="Save to favorites"
                                    >
                                        🤍 Save Location
                                    </button>
                                )}
                            </div>
                        </div>
                        <WeatherCard
                            city={weatherData.location.name}
                            temp={Math.round(unit === 'celsius' ? weatherData.current.temp_c : weatherData.current.temp_f)}
                            humidity={weatherData.current.humidity}
                            wind={Math.round(weatherData.current.wind_kph)}
                            description={weatherData.current.condition.text}
                            icon={weatherData.current.condition.icon}
                            unit={getDisplayUnit()}
                        />
                    </div>

                    <div className="temperature-graph-section">
                        <TemperatureGraph
                            data={weatherData.forecast.forecastday.map(day => ({
                                date: day.date,
                                maxTemp: Math.round(unit === 'celsius' ? day.day.maxtemp_c : day.day.maxtemp_f),
                                minTemp: Math.round(unit === 'celsius' ? day.day.mintemp_c : day.day.mintemp_f)
                            }))}
                            unit={getDisplayUnit()}
                            cityName={weatherData.location.name}
                        />
                    </div>

                    <div className="forecast-section">
                        <h2 className="section-title">7-Day Forecast</h2>
                        <div className="forecast-grid">
                            {weatherData.forecast.forecastday.map((day, index) => (
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
            )}

            {!weatherData && !error && (
                <div className="loading-placeholder">
                    <div className="loading-animation">
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                    </div>
                    <p>Detecting your location...</p>
                </div>
            )}
        </div>
    )
}