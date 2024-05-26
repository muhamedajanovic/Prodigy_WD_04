const apiKeyTomorrow = 'ntvTTFVmls45fh4V86yORyF7hQvT85YJ'; // Zamenite sa vašim Tomorrow.io API ključem
const apiKeyLocationIQ = 'pk.85b1f7b193c1c69a72c274f56f8d248c'; // Zamenite sa vašim LocationIQ API ključem

document
  .getElementById('city-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    showLoading();
    getCoordinates(city)
      .then((coords) => {
        getWeatherData(coords.lat, coords.lon)
          .then((data) => {
            hideLoading();
            displayWeather(data, city);
          })
          .catch((error) => {
            hideLoading();
            console.error('Error fetching weather data:', error);
          });
      })
      .catch((error) => {
        hideLoading();
        console.error('Error fetching coordinates:', error);
      });
  });

async function getCoordinates(city) {
  const geoUrl = `https://us1.locationiq.com/v1/search.php?key=${apiKeyLocationIQ}&q=${city}&format=json`;
  const response = await fetch(geoUrl);
  const data = await response.json();
  if (data.length === 0) {
    throw new Error('City not found');
  }
  const location = data[0];
  return { lat: location.lat, lon: location.lon };
}

async function getWeatherData(lat, lon) {
  const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,weatherCode,humidity,windSpeed,temperatureApparent&timesteps=1h&units=metric&apikey=${apiKeyTomorrow}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function displayWeather(data, city) {
  const locationElement = document.getElementById('location');
  const temperatureElement = document.getElementById('temperature');
  const descriptionElement = document.getElementById('description');
  const humidityElement = document.getElementById('humidity');
  const windElement = document.getElementById('wind');
  const feelsLikeElement = document.getElementById('feels-like');

  const currentWeather = data.data.timelines[0].intervals[0].values;
  const temperature = currentWeather.temperature;
  const weatherCode = currentWeather.weatherCode;
  const humidity = currentWeather.humidity;
  const windSpeed = currentWeather.windSpeed;
  const feelsLike = currentWeather.temperatureApparent;

  const weatherDescription = getWeatherDescription(weatherCode);

  locationElement.textContent = `Location: ${city}`;
  temperatureElement.textContent = `Temperature: ${temperature}°C`;
  descriptionElement.textContent = `Weather: ${weatherDescription}`;
  humidityElement.textContent = `Humidity: ${humidity}%`;
  windElement.textContent = `Wind Speed: ${windSpeed} m/s`;
  feelsLikeElement.textContent = `Feels Like: ${feelsLike}°C`;
}

function getWeatherDescription(weatherCode) {
  const descriptions = {
    0: 'Unknown',
    1000: 'Clear',
    1001: 'Cloudy',
    1100: 'Partly Cloudy',
    1101: 'Mostly Clear',
    1102: 'Mostly Cloudy',
    2000: 'Fog',
    2100: 'Light Fog',
    3000: 'Light Wind',
    3001: 'Wind',
    3002: 'Strong Wind',
    4000: 'Drizzle',
    4001: 'Rain',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    5001: 'Flurries',
    5100: 'Light Snow',
    5101: 'Heavy Snow',
    6000: 'Freezing Drizzle',
    6001: 'Freezing Rain',
    6200: 'Light Freezing Rain',
    6201: 'Heavy Freezing Rain',
    7000: 'Ice Pellets',
    7101: 'Heavy Ice Pellets',
    7102: 'Light Ice Pellets',
    8000: 'Thunderstorm',
  };
  return descriptions[weatherCode] || 'Unknown';
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}
