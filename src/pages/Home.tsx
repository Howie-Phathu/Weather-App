import {useEffect, useState} from 'react';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
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
                    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&aqi=no`);
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
                            <span>3-Day Forecast</span>
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

                    <div className="forecast-section">
                        <h2 className="section-title">3-Day Forecast</h2>
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