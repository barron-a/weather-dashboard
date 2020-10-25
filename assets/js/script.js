// global variables

// DOM variables
cityInputEl = document.getElementById("city-name");
searchButtonEl = document.getElementById("search-button");

// function to validate city name
function inputSubmitHandler(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCurrentWeather(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }
}

// function to fetch current weather
function getCurrentWeather(city) {
    //format the openweather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=fa4b3ff2ab9a05f16ef5ed6b5cb746e8"
    console.log(apiUrl);
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });
}

searchButtonEl.addEventListener("click", inputSubmitHandler);
