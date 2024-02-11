//Define variables
var API_KEY = "3a2e25ab4667f858849318abdf50f13e"; // API key for OpenWeahterMap
var cityInput = document.querySelector("#city-input");
var searchBtn = document.querySelector(".search-button");
var clearBtn = document.querySelector(".clear-button");
var currentWeather = document.querySelector(".current-weather");
var weatherCard = document.querySelector(".five-day-forecast");
var searchHistory = document.querySelector("#search-history");


// Main Dashboard Display
var createWeatherCard = (cityName, weatherItem, index) => {
   if (index === 0) {
    return `
      <div class="current-weather">
        <h2>${cityName} (${dayjs(weatherItem.dt_txt).format("MM/DD/YYYY")})</h2>
          <div class="weather-info">
          <img class="weather-icon-a" src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" />
          <div>
             <h4>Temperature:${weatherItem.main.temp}°F</h4>
            <h4>Wind:${weatherItem.wind.speed} M/s</h4>
            <h4>Humidity:${weatherItem.main.humidity}%</h4>
          </div>
        </div>
      </div>`;
//5-day Forecast        
    } else {
      return `<ul class="col-2 day">
          <li>${dayjs(weatherItem.dt_txt).format(" MM/DD/YYYY")}</li>
          <li class="weather-info">
            <img class="weather-icon" src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" />
            <div>
              <li>Temp:${weatherItem.main.temp}°F</li>
              <li>Wind:${weatherItem.wind.speed} M/s</li>
              <li>Humidity:${weatherItem.main.humidity}%</li>
            </div>
          </li>
        </ul>`;
    }
  }
  
//Get City's Info
var getCityLocation = (cityName) =>{

//console.log(cityName)
var geoUrl =`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
fetch(geoUrl)
    .then(res => res.json()).then(data =>{
        //console.log(data)
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        // save cityName to localStorage
        saveCity(cityName)
        var {name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(()=> {
        alert("An error occurred while fetching coordinates!");
    });
}
var getWeatherDetails = (cityName, lat, lon) =>{
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
    fetch(url)
    .then(res => res.json()).then(data =>{
        //console.log(data);

//Get one forecast perday
    var perday = []; 
    var forecast = data.list.filter(forecast => {
    var forecastDate = new Date(forecast.dt_txt).getDate();
        if(!perday.includes(forecastDate)) {
        return perday.push(forecastDate);
    }
    });
//Clearing previous weather data
    cityInput.value = "";
    currentWeather.innerHTML = "";
    weatherCard.innerHTML = "";

    //console.log(forecast);

    forecast.forEach((weatherItem, index) => {
        if(index === 0) {
        currentWeather.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        }else{
        weatherCard.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
    }
    });
}).catch(()=> {
    alert("An error occurred while fetching weather forecast!");
});
}
//
var saveCity = (cityName) => {
  var savedCities = JSON.parse(localStorage.getItem("cities")) || []

  if (savedCities.includes(cityName)) return;

  savedCities.push(cityName)
  localStorage.setItem("cities", JSON.stringify(savedCities))
  displaySearchHistory();
}

var displaySearchHistory = () => {
  searchHistory.innerHTML = "";
  var savedCities = JSON.parse(localStorage.getItem("cities")) || []
    if (savedCities.length === 0) return;

  for (var i = 0; i < savedCities.length; i++){
    var cityBtn = document.createElement("button");
    cityBtn.textContent = savedCities[i];
    searchHistory.appendChild(cityBtn);
  }
 
}
function cityClick(event){
if (event.target.matches("button")){
  var city = event.target.textContent
getCityLocation(city);
}
}
searchHistory.addEventListener("click", cityClick);
//Search Button
searchBtn.addEventListener("click", function (){
var cityName = cityInput.value.trim();
if(!cityName) return;
getCityLocation(cityName);
});
//Can use the Enter(return) on keyboard
cityInput.addEventListener("keyup", e => {
if (e.key === "Enter") { 
  var cityName = cityInput.value.trim();
 if(!cityName) return;
getCityLocation(cityName);}
});

displaySearchHistory();

//Clear Search History
function clearSearchHistory(){
  localStorage.clear();
  searchHistory.innerHTML = "";
}
clearBtn.addEventListener("click", clearSearchHistory);