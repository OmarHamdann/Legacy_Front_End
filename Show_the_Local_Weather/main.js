var todayWeather = document.getElementById("weather");
var countryName = document.getElementById("country");
var temperate = document.getElementById("temp");
var temperateF = document.getElementById("temp2");
let lat, lon;

// right location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    // take lat and lon
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    //use http to take the data of it
    var Http = new XMLHttpRequest();
    const url = `https://fcc-weather-api.freecodecamp.repl.co/api/current?lat=${lat}&lon=${lon}`;
    Http.addEventListener("load", reqListener);
    Http.responseType = "json";
    Http.open("GET", url);
    Http.send();
  });
}

// error location
else {
  todayWeather.innerHTML = "Geolocation is not supported";
}

function reqListener() {
  // take data
  let data = this.response;
  let weather = data["weather"][0]["main"];
  let temp = data["main"]["temp"];
  let country = data["sys"]["country"];
  let name = data["name"];
  let temp2 = (temp * 9) / 5 + 32;

  // return html
  countryName.innerHTML = `${name}, ${country}`;
  temperate.innerHTML = `${temp.toFixed(1)} °C`;
  temperateF.innerHTML = `${temp2.toFixed(1)} °F`;
  todayWeather.innerHTML = weather;

  // what weather is??
  if (temp >= 35) {
    temperate.style.color = "#FF6347";
  } else if (temp > 20 && temp < 35) {
    temperate.style.color = "#00FFFF";
  } else {
    temperate.style.color = "#4169E1";
  }

  // show correct icon weather
  var showWeather;
  switch (weather) {
    case "Clouds":
      showWeather = "icon " + "cloudy";
      break;
    case "Clear":
      showWeather = "icon " + "sunny";
      break;
    case "Rain":
      showWeather = "icon " + "rainy";
      break;
    case "Snow":
      showWeather = "icon " + "flurries";
      break;
    case "Thunderstom":
      showWeather = "icon " + "thunder-storm";
      break;
    case "Drizzle":
      showWeather = "icon " + "sun-shower";
      break;
  }



  
  // hide all icon weather
  hide(document.getElementsByClassName("icon sun-shower"));
  hide(document.getElementsByClassName("icon thunder-storm"));
  hide(document.getElementsByClassName("icon cloudy"));
  hide(document.getElementsByClassName("icon flurries"));
  hide(document.getElementsByClassName("icon sunny"));
  hide(document.getElementsByClassName("icon rainy"));

  // show weather
  show(document.getElementsByClassName(showWeather));
}

// hide function
function hide(element) {
  element[0].style.display = "none";
}

// close function
function show(element) {
  element[0].style.display = "inline-block";
}
