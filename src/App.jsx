import { useState } from "react";
import "./App.css";

const API_KEY = "7277d394048719a0fcd50bae76a94741";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }
    try {
      setLoading(true);
      setError("");
      setWeather(null);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${API_KEY}&units=metric`
      );
      if (response.status === 404) throw new Error("City not found");
      if (response.status === 429) throw new Error("Too many requests. Try again later");
      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") getWeather();
  };

  return (
    <div className="container">
      <div className="glow-ring" />

      <div className="header">
        <p className="label">PELEC202</p>
        <h1>Weather Finder</h1>
        <p>Search real-time weather for any city</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>

      {loading && <p className="status-message">Loading...</p>}
      {error && <p className="status-message error">{error}</p>}

      {weather && !loading && (
        <div className="weather-card">
          <p className="city-name">{weather.name}</p>
          <p className="temp">
            {Math.round(weather.main.temp)}
            <span>°C</span>
          </p>
          <p className="condition">{weather.weather[0].description}</p>

          <hr className="divider" />

          <div className="weather-meta">
            <div className="meta-item">
              <span className="meta-label">Feels Like</span>
              <span className="meta-value">{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Humidity</span>
              <span className="meta-value">{weather.main.humidity}%</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Wind</span>
              <span className="meta-value">{weather.wind.speed} m/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}