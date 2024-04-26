document.addEventListener('DOMContentLoaded', () => {
    const defaultCity = 'odesa';
    fetchWeatherData(defaultCity);
    const cityForm = document.getElementById('search-form');
    cityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = document.getElementById('input').value.trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            alert('Input city name pls!');
        }
    })
})



function fetchWeatherData(city) {
    const apiKey = '0f08f6b84ccb424699f111544242504'
    const urlApi = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=no&alerts=no`;

    fetch(urlApi)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            displayLocation(data.location);
            displayWeatherData(data);
            updateBackground(data.current.condition.code);
        })
        .catch(function (error) {
            alert('Error fetching wheather data');
            console.error(error);
        })

}
function displayLocation(locationData) {
    const locationContainer = document.getElementById('location');
    locationContainer.innerHTML = `
        <h2 class="city-title">${locationData.name}</h2>
             <h3 class="city-title">${locationData.region}</h3>
        `
};

function displayWeatherData(weatherData) {
    const wrapper = document.querySelector('.wrapper');
    wrapper.innerHTML = ''; // Очистим содержимое, чтобы добавить новые карточки
    const weather = weatherData.forecast.forecastday;

    weather.forEach(function (day, index) {
        let article = document.createElement('article');
        article.className = `wrapper-day dayid${index + 1}`;

        const title = document.createElement('h3');
        title.className = 'wrapper-day__title';
        title.textContent = index === 0 ? 'Today' : `${day.date}`;

        const weatherCondDiv = document.createElement('div');
        weatherCondDiv.className = 'weather-cond';
        weatherCondDiv.innerHTML = `
                <p class="temp">${day.day.maxtemp_c} &deg;C</p>
                <span>${day.day.condition.text}</span>
                <img class="weather-icon" src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
            `;

        const dayTempDiv = document.createElement('div');
        dayTempDiv.className = 'day-temp';
        dayTempDiv.innerHTML = `
                <p><span class="text-bold">Max:</span> ${day.day.maxtemp_c} &deg;C</p>
                <p><span class="text-bold">Min:</span> ${day.day.mintemp_c} &deg;C</p>
            `;

        const riseTimeDiv = document.createElement('div');
        riseTimeDiv.className = 'rise-time';
        riseTimeDiv.innerHTML = `
                <p><span class="text-bold">Sunrise:</span> ${day.astro.sunrise}</p>
                <p><span class="text-bold">Sunset:</span> ${day.astro.sunset}</p>
            `;

        const dayWindDiv = document.createElement('div');
        dayWindDiv.className = 'day-wind';
        const pressureText = index === 0 ? weatherData.current.pressure_mb : day.day.totalprecip_mm;
        dayWindDiv.innerHTML = `
                <p>Wind speed: ${day.day.maxwind_kph} km/h</p>
                <p>Pressure: ${pressureText} mm</p>
            `;

        article.appendChild(title);
        article.appendChild(weatherCondDiv);
        article.appendChild(dayTempDiv);
        article.appendChild(riseTimeDiv);
        article.appendChild(dayWindDiv);

        wrapper.appendChild(article);
    });
}


function updateBackground(conditionCode) {
    const weatherImages = {
        1000: {
            clouds: ["clear.png", "clear.png", "clear.png", "clear.png", "clear.png"],
            sun: "sun.png",
            background: "background.jpg"
        },

        1003: {
            clouds: ["cloudly.png", "cloudly.png", "cloudly.png", "cloudly.png", "cloudly.png"],
            sun: "sun.png",
            background: "background.jpg"
        },
        1006: {
            clouds: ["cloudly.png", "cloudly.png", "cloudly.png", "cloudly.png", "cloudly.png"],
            sun: "sun.png",
            background: "background_rain.jpg"
        },
        1063: {
            clouds: ["reinCloud.png", "reinCloud.png", "reinCloud.png", "reinCloud.png", "reinCloud.png"],
            sun: "sun.png",
            background: "background_rain.jpg"
        },
        1066: {
            clouds: ["snowCloud.png", "snowCloud.png", "snowCloud.png", "snowCloud.png", "snowCloud.png"],
            sun: "sun.png",
            background: "background_rain.jpg"
        },
        1180: {
            clouds: ["reinCloud.png", "reinCloud.png", "reinCloud.png", "reinCloud.png", "reinCloud.png"],
            sun: "sun.png",
            background: "background_rain.jpg"
        },
        1183: {
            clouds: ["reinCloud.png", "reinCloud.png", "reinCloud.png", "reinCloud.png", "reinCloud.png"],
            sun: "sun.png",
            background: "background_rain.jpg"
        }
    }
    const imageSet = weatherImages[conditionCode] || weatherImages['1000'];

    document.querySelectorAll('.cloud').forEach((element, index) => {
        element.src = `./images/${imageSet.clouds[index]}`;
    });
    const sunImage = document.querySelector('.sun');
    sunImage.src = `./images/${imageSet.sun}`;

    document.body.style.backgroundImage = `url(/images/${imageSet.background})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
}


