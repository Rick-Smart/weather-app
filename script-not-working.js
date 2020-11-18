// global variables
var cityName = "";
var lat = "";
var lon = "";
var dateText = "";
var shortDate = "";
var date = "";
var iconFC = "";
var cardTemp = "";
var cardHum = "";
var cityArray = [];
var recentCity = JSON.parse(localStorage.getItem("places")) || [];

// on search button click
$(".btn").on("click", function () {
  var city = $("#search-input").val();
  getWeatherDetails(city);
});

// on saved city button click
$("#saved-cities").on("click", function (event) {
  if (!event.target.matches(".cities")) return;

  var location = event.target.id;

  getWeatherDetails(location);
});

function getWeatherDetails(city) {
  const apikey = "e5484895a48f875416fd40b699c60fe2";
  const query = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;
  
  // First Api Call to 5 day forcast
  $.ajax({
    method: "GET",
    url: query,
  }).then(function (weather) {
    // clears the current city data before loading a new one.
    $("#current-city").empty();
    $("#five-day").empty();

    // set our variables that we need for our second ajax call
    lat = weather.city.coord.lat;
    lon = weather.city.coord.lon;

    // create our cityName variable that we need for our search history function
    cityName = weather.city.name;

    // this is where we need to push the city name to our cities array
    cityArray.push(cityName);

    // this is where we need to store the city name to local storage
    localStorage.setItem("places", JSON.stringify(cityArray));

    for (let i = 5; i < 40; i += 8) {
      // grabbing the date from ajax response
      dateText = weather.list[i].dt_txt;
      // splitting date and time values
      shortDate = dateText.split(" ");
      // setting variable to date text only
      date = shortDate[0];
      // variable to grab icon for weather
      iconFC = weather.list[i].weather[0].icon;
      // variable for temp
      cardTemp = Math.round(kelvinToF(weather.list[i].main.temp));
      // variable for humidity
      cardHum = weather.list[i].main.humidity;

      cardForecast(date, iconFC, cardTemp, cardHum);
    }

    $("#current-city").append(
      $("<h2>").text("City: " + cityName),
      $("<p>").text("Wind: " + weather.list[0].wind.speed),
      $("<p>").text("Humidity: " + weather.list[0].main.humidity),
      $("<p>").text(
        "Temp(F): " + Math.round(kelvinToF(weather.list[0].main.temp))
      )
    );

    // second api call for "onecall" weather forecast
    const apikey = "e5484895a48f875416fd40b699c60fe2";
    const queryTwo = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apikey}`;

    $.ajax({
      method: "GET",
      url: queryTwo,
    }).then(function (uvIndex) {
      $("#current-city").append(
        $("<p>").text("UV Index: " + uvIndex.current.uvi)
      );
    });
  });
}

function kelvinToF(k) {
  return ((k - 273.15) * 1.8 + 32).toFixed(2);
}

function cardForecast(date, iconFC, cardTemp, cardHum) {
  $("#five-day").append(
    $("<div>")
      .attr("class", "card col")
      .append(
        $("<h6>").text(date),
        $("<img>").attr(
          "src",
          "http://openweathermap.org/img/wn/" + iconFC + "@2x.png"
        ),
        $("<p>").text("Temp (F): " + cardTemp),
        $("<p>").text("Humidity: " + cardHum)
      )
  );
}

function recallCities() {
  if (recentCity == []) {
    return;
  } else {
    for (let i = 0; i < recentCity.length; i++) {
      var cityBtn = recentCity[i];
      $("#saved-cities").append(
        $("<button>").text(cityBtn).attr("id", cityBtn).attr("class", "cities")
      );
    }
  }
}
