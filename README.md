# Weather App

A modern, full-page weather application built with React, TypeScript, and Vite. Get current weather and 3-day forecasts for your location and any city around the world.

## Features

- 🌍 **Current Location Weather**: Automatically detects and displays weather for your current location
- 🔍 **Search Any City**: Search and get weather data for any city worldwide
- 📅 **3-Day Forecast**: View detailed 3-day weather forecasts with temperature ranges
- 💾 **Save Favorite Locations**: Save cities to quickly access their weather data
- 🌡️ **Temperature Units**: Toggle between Celsius and Fahrenheit
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your WeatherAPI key:
```env
VITE_OPENWEATHER_KEY=your_weather_api_key_here
```

4. Get a free API key from [WeatherAPI.com](https://www.weatherapi.com/)

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

### Home Page
- Automatically displays current weather and 3-day forecast for your location
- Requires location permission from your browser

### Search Page
- Enter any city name to get current weather and 3-day forecast
- Searched cities are automatically saved to your favorites

### Saved Locations
- View weather data for all your saved cities
- Each city shows current weather and 3-day forecast

## API

This app uses the [WeatherAPI.com](https://www.weatherapi.com/) service for weather data. The API provides:
- Current weather conditions
- 3-day weather forecasts
- Temperature in both Celsius and Fahrenheit
- Humidity, wind speed, and weather descriptions

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **WeatherAPI.com** - Weather data service

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── WeatherCard.tsx # Current weather display
│   ├── ForecastCard.tsx # 3-day forecast display
│   └── TemperatureToggle.tsx # Unit toggle
├── pages/              # Page components
│   ├── Home.tsx        # Current location weather
│   ├── Search.tsx      # City search functionality
│   └── Saved.tsx       # Saved locations
├── contexts/           # React contexts
│   └── TemperatureContext.tsx # Temperature unit state
└── App.tsx             # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.
