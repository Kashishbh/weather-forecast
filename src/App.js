import React from "react";
import "./App.css";
import WeatherMain from "./components/WeatherMain";

function App() {
  return (
    <React.Fragment>
      <div className="container">
        <WeatherMain />
      </div>
      <div className="footer-info">
        <p>
          Developed by <strong>Kashish Bhatnagar</strong> | Powered by{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noreferrer"
          >
            OpenWeatherMap API
          </a>
        </p>
      </div>
    </React.Fragment>
  );
}

export default App;
