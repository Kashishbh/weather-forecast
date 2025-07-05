import React, { useEffect, useState } from "react";
import { WEATHER_API_KEY, BASE_URL } from '../apiKeys';

const WeatherMain = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          setLocationError("Location access denied. Showing default city.");
          fetchWeather(28.67, 77.22); // Default to Delhi
        }
      );
    } else {
      setLocationError("Geolocation not supported by this browser.");
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(
        `${BASE_URL}weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Weather fetch failed:", err);
    }
  };

  return (
    <div className="weather-box">
      {weatherData ? (
        <div>
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <h3>{Math.round(weatherData.main.temp)}°C</h3>
          <p>{weatherData.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
      {locationError && <p className="error">{locationError}</p>}
    </div>
  );
};

export default WeatherMain;
