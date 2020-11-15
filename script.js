$(".btn").on("click", function () {
  var city = $("#search-input").val();
  getWeatherDetails(city);
});
function getWeatherDetails(city) {
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
    for (let i = 0; i < 40; i += 8) {
      // grabbing the date from ajax response
      var dateText = weather.list[i].dt_txt;
      // splitting date and time values
      var shortDate = dateText.split(" ");
      // setting variable to date text only
      var date = JSON.stringify(shortDate[0]);
      // variable to grab icon for weather
      var iconFC = weather.list[i].weather[0].icon;
      // variable for temp
      var cardTemp = kelvinToF(weather.list[i].main.temp);
      // variable for humidity
      var cardHum = weather.list[i].main.humidity;
      console.log(iconFC);
      cardForecast(date, iconFC, cardTemp, cardHum);
    }
    $("#current-city").append(
      $("<h2>").text("City: " + weather.city.name),
      $("<p>").text("Wind: " + weather.list[0].wind.speed),
      $("<p>").text("Humidity: " + weather.list[0].main.humidity),
      $("<p>").text("Temp(F): " + kelvinToF(weather.list[0].main.temp))
    );
    // second api call for 5 day weather forecast
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
      .attr("class", "card col-md-2")
      .append(
        $("<h6>").text(date),
        $("<img>").attr(
          "src",
          "http://openweathermap.org/img/wn/" + iconFC + "@2x.png"
        ),
        $("<p>").text("Temperature (F): " + cardTemp),
        $("<p>").text("Humidity: " + cardHum)
      )
  );
}
