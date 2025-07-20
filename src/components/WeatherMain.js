import React, { useEffect, useState, useRef } from "react";
import apiKeys from "../apiKeys";

function getGreeting(name = "Kashish") {
  const hour = new Date().getHours();
  if (hour < 5) return `Good night! 🌙`;
  if (hour < 12) return `Good morning! ☀️`;
  if (hour < 18) return `Good afternoon! 🌤️`;
  return `Good evening! 🌆`;
}

// Weather icon mapping (can be extended with more icons later)
const weatherIconMap = {
  Clear: require("../images/WeatherIcons.gif"), // Use WeatherIcons.gif for demo
  Clouds: require("../images/WeatherIcons.gif"),
  Rain: require("../images/WeatherIcons.gif"),
  Drizzle: require("../images/WeatherIcons.gif"),
  Thunderstorm: require("../images/WeatherIcons.gif"),
  Snow: require("../images/WeatherIcons.gif"),
  Mist: require("../images/WeatherIcons.gif"),
  Smoke: require("../images/WeatherIcons.gif"),
  Haze: require("../images/WeatherIcons.gif"),
  Fog: require("../images/WeatherIcons.gif"),
  Sand: require("../images/WeatherIcons.gif"),
  Dust: require("../images/WeatherIcons.gif"),
  Ash: require("../images/WeatherIcons.gif"),
  Squall: require("../images/WeatherIcons.gif"),
  Tornado: require("../images/WeatherIcons.gif"),
};

const weatherFacts = [
  "The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, USA.",
  "Raindrops can fall at speeds of about 22 miles per hour.",
  "A bolt of lightning is five times hotter than the surface of the sun.",
  "Snowflakes can take up to an hour to reach the ground.",
  "The coldest temperature ever recorded was -89.2°C (-128.6°F) in Antarctica.",
  "Clouds look white because they reflect sunlight.",
  "The wettest place on Earth is Mawsynram, India.",
  "A hurricane can release the energy of 10,000 nuclear bombs.",
  "The fastest wind speed ever recorded was 253 mph during Cyclone Olivia.",
  "Some tornadoes can be nearly invisible until they pick up dust and debris."
];
function getRandomFact() {
  return weatherFacts[Math.floor(Math.random() * weatherFacts.length)];
}

function getTempColor(temp) {
  if (temp <= 0) return '#3a8dde'; // freezing blue
  if (temp <= 10) return '#5bc0eb'; // cold blue
  if (temp <= 20) return '#f7b32b'; // mild yellow
  if (temp <= 30) return '#f76e11'; // warm orange
  return '#e63946'; // hot red
}

function getDayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

const WeatherMain = ({ theme, setWeatherType }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [searchCity, setSearchCity] = useState("");

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

  useEffect(() => {
    if (weatherData && weatherData.list && weatherData.list[0] && weatherData.list[0].weather && weatherData.list[0].weather[0]) {
      setWeatherType && setWeatherType(weatherData.list[0].weather[0].main);
    }
  }, [weatherData, setWeatherType]);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKeys.key}`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchCity.trim()) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(searchCity)}&units=metric&appid=${apiKeys.key}`
      );
      const data = await response.json();
      if (data.cod === "200") {
        setWeatherData(data);
        setLocationError("");
      } else {
        setLocationError("City not found.");
      }
    } catch (error) {
      console.error("Error fetching weather for city:", error);
      setLocationError("Failed to fetch weather data.");
    }
  };

  // Determine icon based on weather
  let iconSrc = weatherIconMap["Clear"];
  if (weatherData && weatherData.list && weatherData.list[0] && weatherData.list[0].weather && weatherData.list[0].weather[0]) {
    const main = weatherData.list[0].weather[0].main;
    if (weatherIconMap[main]) {
      iconSrc = weatherIconMap[main];
    }
  }

  return (
    <>
      {/* Personalized Greeting */}
      <div style={{ textAlign: "center", fontSize: "1.3rem", fontWeight: 600, marginBottom: 12, letterSpacing: 1 }}>
        {getGreeting("Kashish")}
      </div>
      <div className={`weather-box fade-in${theme === "dark" ? " dark" : ""}`}>
        {/* Search input */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter city name"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className={theme === "dark" ? "input-dark" : ""}
            style={{
              padding: "8px",
              width: "200px",
              borderRadius: "5px",
              border: theme === "dark" ? "1px solid #414345" : "1px solid #ccc",
              background: theme === "dark" ? "#232526" : undefined,
              color: theme === "dark" ? "#f7fafc" : undefined,
              transition: "background 0.5s, color 0.5s, border 0.5s"
            }}
          />
          <button
            onClick={handleSearch}
            className="search-btn"
            style={{
              padding: "8px 12px",
              marginLeft: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: theme === "dark" ? "#414345" : "#007bff",
              color: theme === "dark" ? "#74ebd5" : "#fff",
              border: "none",
              boxShadow: theme === "dark" ? "0 2px 8px #23252633" : "0 2px 8px #007bff33",
              transition: "background 0.3s, color 0.3s, box-shadow 0.3s"
            }}
          >
            Search
          </button>
        </div>

        {/* Dynamic Weather Icon */}
        <img src={iconSrc} alt="Weather Icon" className="weather-icon-anim" />

        {weatherData && weatherData.city && weatherData.list ? (
          <div>
            <h2>
              {weatherData.city.name}, {weatherData.city.country}
            </h2>
            <h3 style={{ color: getTempColor(Math.round(weatherData.list[0].main.temp)), fontWeight: 700, fontSize: '2.2rem', letterSpacing: 1 }}>
              {Math.round(weatherData.list[0].main.temp)}°C
            </h3>
            <p>{weatherData.list[0].weather[0].description}</p>

            {/* Forecast Carousel */}
            <div style={{ margin: '24px 0 0 0' }}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '1.1rem' }}>5-Day Forecast</div>
              <div className="forecast-carousel" style={{ display: 'flex', overflowX: 'auto', gap: 18, paddingBottom: 8 }}>
                {(() => {
                  // Get one forecast per day (at noon)
                  const daily = [];
                  const usedDays = new Set();
                  for (let i = 0; i < weatherData.list.length; i++) {
                    const item = weatherData.list[i];
                    const date = new Date(item.dt_txt);
                    const day = date.getDate();
                    if (date.getHours() === 12 && !usedDays.has(day)) {
                      daily.push(item);
                      usedDays.add(day);
                    }
                    if (daily.length === 5) break;
                  }
                  return daily.map((item, idx) => (
                    <div key={idx} style={{
                      minWidth: 90,
                      background: 'rgba(255,255,255,0.18)',
                      borderRadius: 12,
                      boxShadow: '0 2px 8px #0001',
                      padding: '12px 8px',
                      textAlign: 'center',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      border: '1px solid #eee',
                      transition: 'transform 0.2s',
                      fontWeight: 500,
                    }}>
                      <div style={{ fontSize: 15, marginBottom: 2 }}>{getDayName(item.dt_txt)}</div>
                      <img src={iconSrc} alt="icon" style={{ width: 36, height: 36, margin: '0 auto 2px auto' }} />
                      <div style={{ fontSize: 15, color: getTempColor(Math.round(item.main.temp_max)) }}>{Math.round(item.main.temp_max)}°</div>
                      <div style={{ fontSize: 13, color: getTempColor(Math.round(item.main.temp_min)), opacity: 0.7 }}>{Math.round(item.main.temp_min)}°</div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading weather...</p>
        )}

        {locationError && <p className="error">{locationError}</p>}

        {/* Fun Weather Fact */}
        <div style={{ marginTop: 18, fontSize: "1.05rem", color: theme === "dark" ? "#b2e0f7" : "#2d3a4b", textAlign: "center", fontStyle: "italic", opacity: 0.85 }}>
          🌦️ Fun Fact: {getRandomFact()}
        </div>
      </div>
    </>
  );
};

export default WeatherMain;
