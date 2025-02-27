import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countryList, setCountryList] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCountry, setActiveCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (query.trim() === "") {
      setCountryList([]);
      return;
    }
    const fetchCountryData = async () => {
      try {
        const url = `https://restcountries.com/v3.1/name/${query}`;
        const response = await axios.get(url);
        console.log(response.data);
        setCountryList(response.data);
        setActiveCountry(null);
        setWeatherData(null);

        if (response.data.length === 1) {
          const capital =
            response.data[0].capital && response.data[0].capital[0];
          fetchWeather(capital);
        }
      } catch (error) {
        console.error("Error fetching data: ", error.data);
      }
    };
    fetchCountryData();
  }, [query]);

  const fetchWeather = async (capital) => {
    try {
      const apiKey = import.meta.env.VITE_SOME_KEY;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;
      const weatherResponse = await axios.get(weatherUrl);
      setWeatherData(weatherResponse.data);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching the weather data", error.data);
      setWeatherData(null);
      setFetchError("Failed to fetch weather data");
    }
  };

  const formatLanguages = (languages) => {
    if (Array.isArray(languages)) {
      return languages.join(", ");
    } else if (typeof languages === "object") {
      return Object.values(languages).join(", ");
    } else {
      return "Unknown";
    }
  };

  const handleCountrySelection = (country) => {
    setActiveCountry(country);
    const capital = country.capital;
    fetchWeather(capital);
  };

  return (
    <div>
      <h1>Explore Country Information</h1>

      <label for="search">
        find countries:
        <input
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {countryList.length > 10 && <p>Please be more specific.</p>}

      {countryList.length > 1 && countryList.length <= 10 && (
        <section>
          <h3>Matching Countries:</h3>
          <ul>
            {countryList.map((country) => (
              <li key={country.name.common}>
                {country.name.common}
                <button onClick={() => handleCountrySelection(country)}>
                  View Details
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeCountry && (
        <section>
          <h2>{activeCountry.name.common}</h2>
          <p><strong>Capital:</strong> {activeCountry.capital}</p>
          <p><strong>Land Area:</strong> {activeCountry.area} km²</p>
          <p><strong>Languages:</strong> {activeCountry.languages && formatLanguages(activeCountry.languages)}</p>
          <p><strong>Flag:</strong></p>
          <img src={activeCountry.flags.png} alt={`Flag of ${activeCountry.name.common}`} />

          <h3>Weather Information</h3>
          {weatherData ? (
            <div>
              <p><strong>Location:</strong> {activeCountry.capital[0]}</p>
              <p><strong>Temperature:</strong> {weatherData.main.temp}°C</p>
              <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
              <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
              <p><strong>Conditions:</strong> {weatherData.weather[0].description}</p>
            </div>
          ) : fetchError ? (
            <p class="error">{fetchError}</p>
          ) : (
            <p>Loading weather data...</p>
          )}
        </section>
      )}

      {countryList.length === 1 && (
        <section>
          <h2>{countryList[0].name.common}</h2>
          <p><strong>Capital:</strong> {countryList[0].capital}</p>
          <p><strong>Land Area:</strong> {countryList[0].area} km²</p>
          <p><strong>Languages:</strong> {countryList[0].languages && formatLanguages(countryList[0].languages)}</p>
          <p><strong>Flag:</strong></p>
          <img src={countryList[0].flags.png} alt={`Flag of ${countryList[0].name.common}`} />

          <h3>Weather Overview</h3>
          {weatherData ? (
            <div>
              <p><strong>Location:</strong> {countryList[0].capital[0]}</p>
              <p><strong>Temperature:</strong> {weatherData.main.temp}°C</p>
              <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
              <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
              <p><strong>Conditions:</strong> {weatherData.weather[0].description}</p>
            </div>
          ) : fetchError ? (
            <p class="error">{fetchError}</p>
          ) : (
            <p>Loading weather details...</p>
          )}
        </section>
      )}
    </div>

  );
};

export default App;
