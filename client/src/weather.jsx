import searchIcon from "./assets/search.svg";
import locationIcon from "./assets/location.svg";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
export const WeatherApp = () => {
  //weather data states
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState(
    () => localStorage.getItem("lastCity") || "",
  );
  const [newCity, setNewCity] = useState("");

  //local storage
  useEffect(() => {
    if (city) localStorage.setItem("lastCity", city);
  }, [city]);
  //useEffect
  useEffect(() => {
    if (!city) return;
    async function loadWeatherData() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `${API_URL}/api/weather?city=${encodeURIComponent(city)}`,
        );

        if (!res.ok) {
          if (res.status === 404) throw new Error("City not found!");
          throw new Error("Fetch failed: " + res.status);
        }
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        setError(
          err instanceof TypeError
            ? "Cannot reach the server. Please try again later."
            : err.message,
        );
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    }
    loadWeatherData();
  }, [city]);

  const handleChange = (e) => {
    setNewCity(e.target.value);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const cityTrimmed = newCity.trim();
    if (!cityTrimmed) return;
    setCity(cityTrimmed);
    console.log(cityTrimmed);
    setNewCity("");
  };
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return (
    <>
      <form className="weather-container" onSubmit={handleSearch}>
        <h1>Skyline</h1>
        <div className="search-container">
          <div className="wrapper">
            <span className="location-icon">
              <img src={locationIcon} />
            </span>
            <input
              type="text"
              className="search-input"
              value={newCity}
              onChange={handleChange}
              placeholder="Search city..."
            />
            <span className="search-icon">
              <img src={searchIcon} onClick={handleSearch} />
            </span>
          </div>
        </div>
        {loading && (
          <p style={{ color: "white", textShadow: "0 0px 20px" }}>Loading...</p>
        )}
        {error && (
          <p
            style={{
              color: "red",
              fontSize: "2rem",
              marginTop: "150px",
              textShadow: "0 0px 10px red",
            }}
          >
            {error}
          </p>
        )}
        {weatherData && !loading && (
          <div className="display-container">
            <div className="weather-image">
              {weatherData.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                  alt={weatherData.description}
                />
              )}
            </div>
            <div className="celsius">
              <h2>{Math.round(weatherData.temp)}°C</h2>
            </div>
            <div className="city-name">
              <h2>{weatherData.city}</h2>
              <p>
                {weatherData.country
                  ? `${regionNames.of(weatherData.country)}`
                  : ""}
              </p>
            </div>
            <div className="details">
              <div className="humidity">
                <h4>Humidity</h4>
                <p>{weatherData.humidity}%</p>
              </div>
              <div className="speed">
                <h4>Wind speed</h4>
                <p>{(weatherData.windSpeed * 3.6).toFixed(1)} km/h</p>
              </div>
              <div className="description">
                <h4>Description</h4>
                <p>{weatherData.description}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};
