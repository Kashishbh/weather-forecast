import React, { useState, useEffect } from "react";
import "./App.css";
import WeatherMain from "./components/WeatherMain";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [weatherType, setWeatherType] = useState("Clear");

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogin = (username) => setUser(username);
  const handleLogout = () => setUser(null);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <React.Fragment>
      <div className={`container ${theme} weather-bg-${weatherType.toLowerCase()}`}> {/* Add weatherType class */}
        {!user ? (
          <Login onLogin={handleLogin} theme={theme} />
        ) : (
          <>
            <header className="app-header" style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, minHeight: 64 }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: `url(${require('./images/city.jpg')}) center center/cover no-repeat`,
                opacity: 0.32,
                filter: 'blur(0.5px) saturate(1.1)',
              }} />
              <h1 style={{
                position: 'relative',
                zIndex: 1,
                margin: 0,
                padding: '16px 0 16px 0',
                color: '#1a2639',
                textShadow: '0 2px 8px #fff8',
                fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif',
                fontWeight: 800,
                fontSize: '2.3rem',
                letterSpacing: 2
              }}>Weather App</h1>
              <div style={{ display: "flex", gap: 12, position: 'relative', zIndex: 1 }}>
                <button className="theme-toggle-btn city-theme-btn" style={{ background: 'linear-gradient(90deg, #f7c873 0%, #fffbe7 100%)', color: '#1a2639', border: 'none', fontWeight: 700, fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif', boxShadow: '0 2px 8px #f7c87355' }} onClick={toggleTheme}>
                  {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
                </button>
                <button className="logout-btn city-logout-btn" style={{ background: 'linear-gradient(90deg, #1a2639 0%, #30415d 100%)', color: '#fffbe7', border: 'none', fontWeight: 700, fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif', boxShadow: '0 2px 8px #1a263955' }} onClick={handleLogout}>Logout</button>
              </div>
            </header>
            <WeatherMain theme={theme} setWeatherType={setWeatherType} />
          </>
        )}
      </div>
      <div className="footer-info">
        <p>
          Developed by <strong>Kashish Bhatnagar</strong>
        </p>
      </div>
    </React.Fragment>
  );
}

export default App;
