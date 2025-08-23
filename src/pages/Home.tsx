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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { unit, getDisplayUnit } = useTemperature();

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
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
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                setError(`Geolocation error: ${error.message}`);
                setLoading(false);
            }
        );
    }, []);

    if (loading) {
        return <p className="loading">Loading...</p>;
    }
    if (error) {
        return <p className="error">{error}</p>;
    }
    if (!weatherData) {
        return <p className="error">No weather data available.</p>;
    }

    const temperature = unit === 'celsius' ? weatherData.current.temp_c : weatherData.current.temp_f;

    return(
        <div className="home-page">
            <h1>Current Location Weather</h1>
            <WeatherCard
                city={weatherData.location.name}
                temp={Math.round(temperature)}
                humidity={weatherData.current.humidity}
                wind={Math.round(weatherData.current.wind_kph)}
                description={weatherData.current.condition.text}
                icon={weatherData.current.condition.icon}
                unit={getDisplayUnit()}
            />
        </div>
    )
}