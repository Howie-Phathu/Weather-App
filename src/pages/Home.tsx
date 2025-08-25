import {useEffect, useState} from 'react';
import WeatherCard from '../components/WeatherCard';
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
}

export default function Home() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
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
                    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data: WeatherData = await response.json();
                    setWeatherData(data);
                } catch (error: any) {
                    setError(`Error fetching weather data: ${error.message}`);
                }
            },
            (error) => {
                setError(`Geolocation error: ${error.message}`);
            }
        );
    }, []);

    return(
        <div className="home-page">
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
                        <span className="feature-icon">💾</span>
                        <span>Save Favorite Locations</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🌡️</span>
                        <span>Celsius/Fahrenheit Toggle</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <p className="error-hint">Try refreshing the page or check your internet connection.</p>
                </div>
            )}

            {weatherData && (
                <div className="current-weather-section">
                    <h2 className="section-title">Current Location Weather</h2>
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