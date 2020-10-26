// global variables

// DOM variables
cityNameSearch = document.getElementById("city-name");
searchButtonEl = document.getElementById("search-button");
weatherContainerEl = document.getElementById("current-weather-container");
currentCity = document.getElementById("city");
currentTemp = document.getElementById("temperature");
currentHumidity = document.getElementById("humidity");
currentWindSpeed = document.getElementById("wind-speed");
currentUvIndex = document.getElementById("uv-index");

// function to validate city name
function inputSubmitHandler(event) {
    event.preventDefault();
    var city = cityNameSearch.value.trim();
    if (city) {
        getCurrentWeather(city);
        cityNameSearch.value = "";
    } else {
        alert("Please enter a city name");
    }
}

// function to fetch current weather
function getCurrentWeather(city) {
    //format the openweather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=fa4b3ff2ab9a05f16ef5ed6b5cb746e8"
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data, weather) {
                console.log(data)
                displayCurrentWeather(data, city)
            });
        } else {
            alert("Error: " + response.statusText)
        }
    })
    .catch(function(error) {
        alert("Unable to conect to OpenWeather")
    })
}

function displayCurrentWeather(weather, cityNameSearch) {
    var temperature = weather.main.temp;
    var humidity = weather.main.humidity + "%";
    var windSpeed = weather.wind.speed + "MPH";
    currentCity.textContent = cityNameSearch.charAt(0).toUpperCase() + cityNameSearch.slice(1);
    currentTemp.textContent = temperature;
    currentHumidity.textContent = humidity;
    currentWindSpeed.textContent = windSpeed;


}

searchButtonEl.addEventListener("click", inputSubmitHandler);
