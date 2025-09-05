@echo off
echo 🌤️  Weather App Setup
echo =====================
echo.
echo This script will help you set up the Weather App.
echo.

REM Check if .env file exists
if exist ".env" (
    echo ✅ .env file already exists
) else (
    echo 📝 Creating .env file...
    echo VITE_OPENWEATHER_KEY=your_weather_api_key_here > .env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: You need to edit the .env file and add your WeatherAPI key
    echo    Get a free API key from: https://www.weatherapi.com/
    echo    Replace 'your_weather_api_key_here' with your actual API key
)

echo.
echo 📦 Installing dependencies...
npm install

echo.
echo 🚀 Starting development server...
echo    The app will be available at: http://localhost:5173
echo.
echo 📖 For more information, see the README.md file
echo.

npm run dev
