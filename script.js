const API_KEY = '319e0e0cce1d4eb4b7465254250103';
const weatherInfo = document.querySelector('.weather-info');
const error = document.getElementById("error");
const loading = document.getElementById("loading");

async function getWeatherByCity(cityName) {
    showLoading();
    console.log("Fetching weather for:", cityName);

    try {
        const weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7&aqi=no&alerts=no`;
        console.log("API URL:", weatherURL);

        const response = await fetch(weatherURL);
        console.log("Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.error) {
            throw new Error(data.error.message);
        }

        displayWeather(data);
    } catch (err) {
        console.error("Fetch Error:", err);
        showError(err.message);
    }
}

function getWeather() {
    const cityInput = document.getElementById("city-input").value.trim();
    if (!cityInput) return;
    getWeatherByCity(cityInput);
}

function displayWeather(data) {
    console.log("Displaying weather data:", data);

    weatherInfo.style.display = 'block';
    error.style.display = 'none';
    loading.style.display = 'none';

    document.getElementById("city-name").textContent = data.location.name;
    document.getElementById("date").textContent = data.location.localtime;
    document.getElementById("temperature").textContent = `${data.current.temp_c}°C`;
    document.getElementById("weather-description").textContent = data.current.condition.text;
    document.getElementById("weather-icon").src = `https:${data.current.condition.icon}`;
    document.getElementById("feels-like").textContent = `${data.current.feelslike_c}°C`;
    document.getElementById("humidity").textContent = `${data.current.humidity}%`;
    document.getElementById("wind-speed").textContent = `${data.current.wind_kph} km/h`;
    document.getElementById("uv-index").textContent = data.current.uv;

    // Get forecast container
    const forecastContainer = document.getElementById("forecast");
    
    // Check if the forecast container exists
    if (!forecastContainer) {
        console.error("Error: Element with ID 'forecast' not found.");
        return;
    }
    
    // Clear previous forecast
    forecastContainer.innerHTML = '';

    // Populate forecast
    data.forecast.forecastday.forEach(day => {
        const forecastDay = document.createElement("div");
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <h3>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
            <img class="forecast-icon" src="https:${day.day.condition.icon}" alt="Weather Icon">
            <p>${Math.round(day.day.maxtemp_c)}°C / ${Math.round(day.day.mintemp_c)}°C</p>
            <p>${day.day.condition.text}</p>
        `;
        forecastContainer.appendChild(forecastDay);
    });
}

function showError(message) {
    error.style.display = 'block';
    error.textContent = message;
    weatherInfo.style.display = 'none';
    loading.style.display = 'none';
}

function showLoading() {
    loading.style.display = 'block';
    error.style.display = 'none';
    weatherInfo.style.display = 'none';
}

document.getElementById("city-input").addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

window.addEventListener('load', () => {
    document.getElementById("city-input").value = 'London';
    getWeatherByCity('london');
});
