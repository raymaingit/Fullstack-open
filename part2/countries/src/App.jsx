import { useState, useEffect } from 'react'
import axios from 'axios'

const WeatherView = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (!capital) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Error fetching weather data:', error)
      })
  }, [capital, api_key])

  if (!weather) {
    return null
  }

  const iconCode = weather.weather[0].icon
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = event => {
    setSearchQuery(event.target.value)
  }

  const handleShowCountry = countryName => {
    setSearchQuery(countryName)
  }

  const filteredCountries = searchQuery
    ? countries.filter(country =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div>
      <div>
        find countries <input value={searchQuery} onChange={handleSearchChange} />
      </div>

      {searchQuery && (
        <div>
          {filteredCountries.length > 10 ? (
            <p>Too many matches, specify another filter</p>
          ) : filteredCountries.length > 1 ? (
            filteredCountries.map(country => (
              <div key={country.cca3}>
                {country.name.common}{' '}
                <button onClick={() => handleShowCountry(country.name.common)}>
                  show
                </button>
              </div>
            ))
          ) : filteredCountries.length === 1 ? (
            (() => {
              const country = filteredCountries[0]
              const capital = country.capital ? country.capital[0] : null
              return (
                <div>
                  <h2>{country.name.common}</h2>
                  <p>capital {capital || 'N/A'}</p>
                  <p>area {country.area}</p>

                  <h3>languages:</h3>
                  <ul>
                    {country.languages &&
                      Object.values(country.languages).map(lang => (
                        <li key={lang}>{lang}</li>
                      ))}
                  </ul>

                  <img
                    src={country.flags.svg}
                    alt={`Flag of ${country.name.common}`}
                    width='150'
                  />

                  {capital && <WeatherView capital={capital} />}
                </div>
              )
            })()
          ) : (
            <p>No matches found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default App