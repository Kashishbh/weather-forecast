import React, { useEffect, useState } from "react";
import apiKeys from "../apiKeys"; 

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
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKeys.key}`
    );
    const data = await response.json();
    console.log("Fetched weather data:", data);
    setWeatherData(data);
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
};

  return (
    <div className="weather-box">
      {weatherData && weatherData.sys ? (
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
