// calling function to render the last searched city
renderLast();
// event listener for search button
$(".btn").on("click", function (e) {
  e.preventDefault();
  // variable for user input in search text area
  var city = $("#search-input").val();
  // setting last searched item to local storage to be rendered on page reload
  cityOnload = localStorage.setItem("cityStored", city);
  // guard statement against running when empty
  if (city === "") {
    return;
  } else {
    // else run the function to get weather data for city
    getWeatherDetails(city, true);
  }
});
//
$("#saved-cities").on("click", function (e) {
  if (!e.target.matches(".btnCity")) return;
  var saveCity = e.target.id;
  getWeatherDetails(saveCity, false);
  console.log(saveCity);
});
function getWeatherDetails(city, addButton) {
  const apikey = "e5484895a48f875416fd40b699c60fe2";
  const query = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;
  // Create an AJAX call to retrieve data
  $.ajax({
    method: "GET",
    url: query,
  }).then(function (weather) {
    console.log(weather);
    var lat = weather.city.coord.lat;
    var lon = weather.city.coord.lon;
    $("#five-day").text("");
    for (let i = 5; i < 40; i += 8) {
      // grabbing the date from ajax response
      var dateText = weather.list[i].dt_txt;
      // splitting date and time values
      var shortDate = dateText.split(" ");
      // setting variable to date text only
      var date = shortDate[0];
      // variable to grab icon for weather
      var iconFC = weather.list[i].weather[0].icon;
      // variable for temp
      var cardTemp = Math.round(kelvinToF(weather.list[i].main.temp));
      // variable for humidity
      var cardHum = weather.list[i].main.humidity;
      cardForecast(date, iconFC, cardTemp, cardHum);
    }
    if (addButton) {
      searchHistory(weather.city.name);
    }
    $("#current-city").text("");
    $("#current-city").append(
      $("<h2>").text("City: " + weather.city.name),
      $("<p>").text("Wind: " + weather.list[0].wind.speed),
      $("<p>").text("Humidity: " + weather.list[0].main.humidity + "%"),
      $("<p>").text(
        "Temp(F): " + Math.round(kelvinToF(weather.list[0].main.temp))
      )
    );
    // second api call for 5 day weather forecast
    const apikey = "e5484895a48f875416fd40b699c60fe2";
    const queryTwo = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apikey}`;
    $.ajax({
      method: "GET",
      url: queryTwo,
    }).then(function (uvIndex) {
      $("#current-city").append(
        $("<p>")
          .text("UV Index: " + uvIndex.current.uvi)
          .attr("id", "ultra-violet")
      );
      if (uvIndex.current.uvi <= 2) {
        $("#ultra-violet").attr("class", "good");
      } else if (uvIndex.current.uvi <= 5) {
        $("#ultra-violet").attr("class", "moderate");
      } else if (uvIndex.current.uvi > 5) {
        $("#ultra-violet").attr("class", "severe");
      }
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
function searchHistory(cityName) {
  $("#saved-cities").append(
    $("<button>")
      .text(cityName)
      .attr("class", "btnCity btn-block col btn-outline-success")
      .attr("id", cityName)
      .text(cityName)
  );
}
function renderLast(cityOnload) {
  var cityOnload = localStorage.getItem("cityStored");
  if (!cityOnload) {
    return;
  } else {
    getWeatherDetails(cityOnload, true);
  }
}
