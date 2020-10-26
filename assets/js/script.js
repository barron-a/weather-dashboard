// DOM variables
var cityNameSearch = document.getElementById("city-name");
var searchButtonEl = document.getElementById("search-button");
var weatherContainerEl = document.getElementById("current-weather-container");
var currentCity = document.getElementById("city");
var currentTemp = document.getElementById("temperature");
var currentHumidity = document.getElementById("humidity");
var currentWindSpeed = document.getElementById("wind-speed");
var fiveDayDate = document.getElementById("date");
var fiveDayIcon = document.getElementById("weather-icon");
var fiveDayTemp = document.getElementById("five-day-temp");
var fiveDayHumidity = document.getElementById("five-day-humidity");
var currentDate = " (" + moment().format("l") + ")";

// function to validate city name
function inputSubmitHandler(event) {
    event.preventDefault();
    var city = cityNameSearch.value.trim();
    if (city) {
        getCurrentWeather(city);
        getFiveDayForecast(city);
        cityNameSearch.value = "";
    } else {
        alert("Please enter a city name");
    }
}

// function to fetch current weather
function getCurrentWeather(city) {
    //format the openweather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=fa4b3ff2ab9a05f16ef5ed6b5cb746e8";
    console.log(apiUrl);
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;
                var uvApiUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=fa4b3ff2ab9a05f16ef5ed6b5cb746e8";
                displayCurrentWeather(data, city)
                return fetch(uvApiUrl);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
                var uvIndex = response.value;
                var currentUvIndexEl = document.getElementById("uv-index");
                currentUvIndexEl.textContent = uvIndex;
                if (uvIndex <= 2) {
                    currentUvIndexEl.setAttribute("class", "bg-success");
                } else if (uvIndex > 7) {
                    currentUvIndexEl.setAttribute("class", "bg-danger");
                } else {
                    currentUvIndexEl.setAttribute("class", "bg-warning");
                };
            })
        } else {
            alert("Error: " + response.statusText)
        }
    })
        .catch(function (error) {
            alert("Unable to conect to OpenWeather")
        })
}

// function to display 
function displayCurrentWeather(weather, cityNameSearch) {
    var temperature = weather.main.temp + " °F";
    var humidity = weather.main.humidity + "%";
    var windSpeed = weather.wind.speed + " MPH";
    var iconCode = weather.weather[0].icon;
    var icon = document.createElement("img");
    icon.src = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"

    currentCity.textContent = cityNameSearch.charAt(0).toUpperCase() + cityNameSearch.slice(1);
    currentCity.append(currentDate);
    currentCity.append(icon);
    currentTemp.textContent = temperature;
    currentHumidity.textContent = humidity;
    currentWindSpeed.textContent = windSpeed;
}

function getFiveDayForecast(city) {
    var fiveDayApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=fa4b3ff2ab9a05f16ef5ed6b5cb746e8";
    console.log(fiveDayApiUrl);
    fetch(fiveDayApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayForecast(data, city);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        })
}
function displayForecast() {

}

searchButtonEl.addEventListener("click", inputSubmitHandler);
