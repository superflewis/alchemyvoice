
document.addEventListener('DOMContentLoaded', () => {
    const weatherWidget = document.getElementById('weather-widget');

    fetch('/api/weather')
        .then(response => response.json())
        .then(data => {
            weatherWidget.innerText = `Current weather: ${data.weather}`;
        })
        .catch(error => {
            weatherWidget.innerText = 'Failed to load weather data';
        });
});
