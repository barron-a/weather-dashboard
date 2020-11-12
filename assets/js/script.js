// variables
var cityNameSearch = document.getElementById("city-name");
var searchButtonEl = document.getElementById("search-button");
var weatherContainerEl = document.getElementById("current-weather-container");
var currentCity = document.getElementById("city");
var currentTemp = document.getElementById("temperature");
var currentHumidity = document.getElementById("humidity");
var currentWindSpeed = document.getElementById("wind-speed");
var day = document.getElementById("day");
var clearSearch = document.getElementById("clear-search");
var listItem = document.querySelector("list-group-item");
var currentDate = " (" + moment().format("l") + ")";

// function to clear search history
function emptyStorage() {
    localStorage.clear("cities");
    location.reload();
}

// function to load previously searched cities from search history
// function loadCities() {
//     if (localStorage.getItem("cities") === null) {
//         var cities = [];
//     } else {
//         var cities = JSON.parse(localStorage.getItem("cities"));
//         for (i = 0; i < cities.length; i++) {
//             var cityList = document.getElementById("prev-cities");
//             var cityListItem = document.createElement("li");
//             cityListItem.setAttribute("class", "list-group-item text-capitalize");
//             cityListItem.textContent = cities[i];
//             //var clickableCity = document.querySelector("list-group-item");
//             //clickableCity.addEventListener("click", getCurrentWeather(cityListItem.textContent));
//             //cityList.insertBefore(cityListItem, cityList.childNodes[0]);
//         };
//     }
// }

// function to validate city name and create a list item on the left for the entry
// function inputSubmitHandler(event) {
//     event.preventDefault();
//     var city = cityNameSearch.value.trim();
//     var cities;

//     if (localStorage.getItem("cities") === null) {
//         cities = [];
//     } else {
//         cities = JSON.parse(localStorage.getItem("cities"));
//     }

//     cities.push(city);
//     localStorage.setItem("cities", JSON.stringify(cities));

//     if (city) {
//         // add searched city to list on left
//         var cityList = document.getElementById("prev-cities");
//         var cityListItem = document.createElement("li");
//         cityListItem.setAttribute("id", city);
//         cityListItem.setAttribute("class", "list-group-item text-capitalize");
//         cityListItem.textContent = city
//         //cityList.insertBefore(cityListItem, cityList.childNodes[0]);
//         cityList.append(cityListItem);

//         getCurrentWeather(city);
//         getFiveDayForecast(city);
//         cityNameSearch.value = "";
//     } else {
//         alert("Please enter a city name");
//     };
// }

function inputSubmitHandler() {
    if (localStorage.getItem("cities") === null) {
        cities = [];
    } else {
        cities = JSON.parse(localStorage.getItem("cities"));
    }
    $(".history").empty()
    $(".history").append("<ul class='list-group'></ul>")
    for (i = 0; i < cities.length; i++) {
        $(".list-group").append(`<li id=${cities[i]}><button>${cities[i]}</button></li>`)
    }
    console.log(cities[-1]);
    getCurrentWeather(cities[-1]);
    getFiveDayForecast(cities[-1]);
    cityNameSearch.value = "";
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
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
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

// function to display current weather
function displayCurrentWeather(weather, cityNameSearch) {
    var temperature = weather.main.temp + " °F";
    var humidity = weather.main.humidity + "%";
    var windSpeed = weather.wind.speed + " MPH";
    var iconCode = weather.weather[0].icon;
    var icon = document.createElement("img");
    icon.src = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"

    currentCity.textContent = cityNameSearch;
    currentCity.setAttribute("class", "text-capitalize");
    currentCity.append(currentDate);
    currentCity.append(icon);
    currentTemp.textContent = temperature;
    currentHumidity.textContent = humidity;
    currentWindSpeed.textContent = windSpeed;
}

// function to get five day forecast
function getFiveDayForecast(city) {
    var fiveDayApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=fa4b3ff2ab9a05f16ef5ed6b5cb746e8";
    console.log(fiveDayApiUrl);
    fetch(fiveDayApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayForecast(data, city);
            })
        };
    })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        })
}

// function to display the five day forecast
function displayForecast(forecast, cityNameSearch) {
    var cardDeck = document.getElementById("card-deck")
    cardDeck.innerHTML = "";
    for (i = 0; i < 40; i += 8) {
        // 5 day date variable work
        var fiveDateTime = forecast.list[i].dt_txt;
        var fiveDateNoTime = fiveDateTime.split(" ", 1);
        dateStr = fiveDateNoTime.toString();
        var fiveDate = moment(dateStr).format("l");

        // 5 day icon variable work
        var fiveIconCode = forecast.list[i].weather[0].icon;
        var fiveIcon = document.createElement("img");
        fiveIcon.src = "http://openweathermap.org/img/wn/" + fiveIconCode + "@2x.png"

        // 5 day temp variable
        var fiveTemp = forecast.list[i].main.temp;

        // 5 day humidity variable
        var fiveHumidity = forecast.list[i].main.humidity;

        var dayCard = document.createElement("div")
        dayCard.setAttribute("class", "card text-white bg-primary mx-2")
        cardDeck.appendChild(dayCard);

        var cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");
        dayCard.appendChild(cardBody);

        var cardDate = document.createElement("h5");
        cardDate.textContent = fiveDate;
        cardBody.appendChild(cardDate);

        cardBody.appendChild(fiveIcon);

        var cardTemp = document.createElement("p");
        cardTemp.textContent = "Temp: " + fiveTemp + "°F";
        cardBody.appendChild(cardTemp);

        var cardHumidity = document.createElement("p");
        cardHumidity.textContent = "Humidity: " + fiveHumidity + "%";
        cardBody.appendChild(cardHumidity);
    }
}

// function to execute when search history list item is clicked
// function clickedCity() {
//     getCurrentWeather(this.value.trim());
// }

//loadCities();

//event listeners
searchButtonEl.addEventListener("click", inputSubmitHandler);
clearSearch.addEventListener("click", emptyStorage);

$(document).ready(function () {
    $(document).on("click", "ul.list-group li", function (event) {
        event.preventDefault();
        $("ul.list-group li").click(function (event) {
            console.log(event);
            console.log(event.target);
            var city = $("ul.list-group li").attr("id");
            console.log(city);
            getCurrentWeather(city);
        })
    });
})