async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const result = document.getElementById("weatherResult");

    if (!city) {
        result.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    try {
        result.innerHTML = "<p>Loading...</p>";

        // Free Open-Meteo Geocoding API
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        if (!geoResponse.ok) {
            throw new Error("Failed to fetch location data.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found.");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Weather API
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        const weather = weatherData.current_weather;

        result.innerHTML = `
            <h2>${name}, ${country}</h2>
            <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
            <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
            <p><strong>Weather Code:</strong> ${weather.weathercode}</p>
            <p><strong>Time:</strong> ${weather.time}</p>
        `;
    } catch (error) {
        result.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}