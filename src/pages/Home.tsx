import {useEffect, useState} from 'react';
import WeatherCard from '../components/WeatherCard';
import { useTemperature } from '../contexts/TemperatureContext';
import "./Home.css";

interface WeatherData {
    name: string;
    main: {
        temp: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}

export default function Home() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getApiUnits, getDisplayUnit } = useTemperature();

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat= position.coords.latitude;
                const lon = position.coords.longitude;
                const apiKey= import.meta.env.VITE_WEATHER_API_KEY;

                try{
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${getApiUnits()}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data: WeatherData = await response.json();
                    setWeatherData(data);
                }catch (error:any){
                    setError(`Error fetching weather data: ${error.message}`);
                }finally{
                    setLoading(false);
                }
            },
            (error) => {
                setError(`Geolocation error: ${error.message}`);
                setLoading(false);
            }
        );
    }, [getApiUnits]);
    if (loading) {
        return <p className="loading">Loading...</p>;
    }
    if (error) {
        return <p className="error">{error}</p>;
    }
    if (!weatherData) {
        return <p className="error">No weather data available.</p>;
    }

    return(
        <div className="home-page">
            <h1>Current Location Weather</h1>
            <WeatherCard
                city={weatherData.name}
                temp={weatherData.main.temp}
                humidity={weatherData.main.humidity}
                wind={weatherData.wind.speed}
                description={weatherData.weather[0].description}
                icon={weatherData.weather[0].icon}
                unit={getDisplayUnit()}
            />

        </div>
    )
}