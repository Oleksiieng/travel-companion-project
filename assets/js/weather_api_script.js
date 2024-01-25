 //# Code fetched from weather api ninja

const url = "https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=London";
const options = {
method: "GET",
headers: {
"content-type": "application/octet-stream",
"X-RapidAPI-Key": "763c810bdfmshb9f4669b80c3925p18d818jsn3db5be365864",
"X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com"
}
};

//# Function for searching the city



const getWeather=(city)=>{
    cityName.innerHTML=city;

// # url will set to dynamic city 

fetch("https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city="+city, options)
.then(response => response.json())
.then((response) => {
    
    console.log(response)

    cloud_pct.innerHTML = response.cloud_pct
    temp.innerHTML = response.temp
    temp2.innerHTML = response.temp
    feels_like.innerHTML = response.feels_like
    humidity.innerHTML = response.humidity
    humidity2.innerHTML = response.humidity
    min_temp.innerHTML = response.min_temp
    max_temp.innerHTML = response.max_temp
    wind_speed.innerHTML = response.wind_speed
    wind_speed2.innerHTML = response.wind_speed
    wind_degrees.innerHTML = response.wind_degrees
    sunrise.innerHTML = response.sunrise
    sunset.innerHTML = response.sunset
})
.catch(err => console.error(err));
}

submit.addEventListener("click",(e)=>{
    e.preventDefault();
    getWeather(city.value);
})

//# Default location is set to london

getWeather("London");

$(document).ready(function() {
    // Set initial display style for weather-info-box
    $(".weather-info-box").css("display", "none");

    // Add click event to the submit button
    $("#submit-button").click(function() {
        // Toggle the visibility of the weather info box on click
        $(".weather-info-box").toggle();
    });
});
