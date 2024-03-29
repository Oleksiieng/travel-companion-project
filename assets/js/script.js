const apiKey = 'addd5a1a8efb42c9ad97ecfd8f615f6c';
const map = L.map('map').setView([1, 1], 2);
let input = document.getElementById('search-input');
let jsonData = [];


// Weather_api section
const weatherApiKey = "763c810bdfmshb9f4669b80c3925p18d818jsn3db5be365864";
const weatherOptions = {
    method: "GET",
    headers: {
        "content-type": "application/octet-stream",
        "X-RapidAPI-Key": weatherApiKey, // Use the new variable name
        "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com"
    }
};

const getWeather = (city) => {
    cityName.innerHTML=city;

    // # url will set to dynamic city 

    fetch(`https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${encodeURIComponent(city)}`, weatherOptions)
    .then(response => response.json())
    .then(response => {
        console.log(response)
        // var d = 1234567890000)

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
        sunrise.innerHTML = new Date(response.sunrise).toLocaleTimeString();
        sunset.innerHTML = new Date(response.sunset).toLocaleTimeString();
        document.querySelector('.weather-info-box').style.display = 'block';
    })
    .catch(err => console.error(err));
}

// autocomlete
input.addEventListener('input', function () {
    const value = this.value;

    if (value.length < 3) {
        suggestions.style.display = 'none';
        return;
    }

    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            suggestions.innerHTML = '';
            data.features.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.properties.formatted;
                li.onclick = function () {
                    input.value = item.properties.formatted;
                    suggestions.style.display = 'none';
                };
                suggestions.appendChild(li);
            });
            suggestions.style.display = 'block';
        });
});

//map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value;
    // getting the weather details
    getWeather(searchInput);

    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchInput)}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
          
                const coordinates = data.features[0].geometry.coordinates;
                const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
                map.setView([coordinates[1], coordinates[0]], 15);
                getWikiImage(data.features[0].properties.city);
                getWikiDescription(data.features[0].properties.city);

            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching location coordinates:', error);
        });
});

function showOnMap(index) {
    console.log("Index:", index);
    console.log("jsonData:", jsonData);

    const item = jsonData[index];
    if (!item) {
        console.error("Item not found at index", index);
        return;
    }

    const coordinates = [item.lat, item.lon];
    const marker = L.marker(coordinates).addTo(map);
    map.setView(coordinates, 20);
}


// fetch-geoapify-data
const suggestions = document.getElementById('suggestions');
let selectedPlaceId = null;

function handleFormSubmit(event) {
    event.preventDefault();
    hideInfoBlocks(); 
    const isHotelChecked = document.getElementById('option-hotel').checked;
    const isRestaurantChecked = document.getElementById('option-restaurant').checked;

    const categories = [];
    if (isHotelChecked) categories.push('accommodation.hotel');
    if (isRestaurantChecked) categories.push('catering.restaurant');

    getPlaceDetails(selectedPlaceId, categories.join(',')).then(places => {
        jsonData = places;
        createBootstrapCards(places);
    });
}

function handleInput(event) {
    const value = event.target.value;
    const suggestions = document.getElementById('suggestions');

    if (value.length < 3) {
        suggestions.style.display = 'none';
        return;
    }

    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {

            suggestions.innerHTML = '';
            data.features.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.properties.formatted;
                li.onclick = function () {
                    document.getElementById('search-input').value = item.properties.formatted;
                    selectedPlaceId = item.properties.place_id;
                    suggestions.style.display = 'none';
                };
                suggestions.appendChild(li);
            });
            suggestions.style.display = 'block';
        });
}


function getPlaceDetails(placeId, categories) {
    return fetch(`https://api.geoapify.com/v2/places?categories=${categories}&filter=place:${placeId}&limit=20&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            return data.features.map(feature => {
                return {
                    name: feature.properties.name,
                    city: feature.city,
                    address: feature.properties.formatted,
                    categories: feature.properties.categories,
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0]
                };
            });
        });
}


function createBootstrapCards(data) {
    let cardContent = '<div class="row">';

    data.forEach((item, index) => {
        cardContent += `
            <div class="col-md-3">
                <div class="card card-style">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.address}</p>
                        <a href="#" class="btn btn-primary" onclick="showOnMap(${index})">Show on Map</a>
                    </div>
                </div>
            </div>`;
    });

    cardContent += '</div>';

    document.getElementById('results-cards').innerHTML = cardContent;
}


function getWikiDescription(cityName){
    
    const proxyUrl = 'https://corsproxy.io/?';

    const wikipediaApiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&titles=${encodeURIComponent(cityName)}`;

    const urlWithProxy = proxyUrl + encodeURIComponent(wikipediaApiUrl);
    fetch(urlWithProxy)
        .then(response => response.json())
        .then(result => {
            var page = Object.values(result.query.pages)[0];
            var modalBody = document.querySelector('#wikiModal .modal-body');
            modalBody.textContent = page.extract;

            $('#wikiModal').modal('show');
        })
        .catch(error => console.log('error', error));
}

// images https://www.mediawiki.org/wiki/API:Images#JavaScript
function getWikiImage(title) {
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        action: "query",
        prop: "images",
        titles: title,
        format: "json"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });

    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            var pages = response.query.pages;
            for (var page in pages) {
                var images = pages[page].images.slice(0, 3);
                for (var img of images) {
                    getImage(img.title);
                }
            }
        })
        .catch(function (error) { console.log(error); });
}


function getImage(img) {
    console.log('+++++++++++++++++++++++++++++++++++++++');
    var url = "https://en.wikipedia.org/w/api.php";
    var params = {
        action: "query",
        prop: "imageinfo",
        titles: img, 
        iiprop: "url",
        format: "json"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) { url += "&" + key + "=" + encodeURIComponent(params[key]); });

    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            var pages = response.query.pages;
            var carouselInner = document.querySelector('#wikiGalleryCarousel .carousel-inner');
            var carouselIndicators = document.querySelector('#wikiGalleryCarousel .carousel-indicators');

            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';

            Object.keys(pages).forEach((page, index) => {
                if (pages[page].imageinfo) {
                    var imageUrl = pages[page].imageinfo[0].url;
                    var carouselItem = document.createElement('div');
                    carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');

                    var img = document.createElement('img');
                    img.className = 'd-block w-100';
                    img.src = imageUrl;
                    carouselItem.appendChild(img);

                    carouselInner.appendChild(carouselItem);

                    var indicator = document.createElement('li');
                    indicator.setAttribute('data-target', '#wikiGalleryCarousel');
                    indicator.setAttribute('data-slide-to', index);
                    if (index === 0) {
                        indicator.className = 'active';
                    }

                    carouselIndicators.appendChild(indicator);
                }
            });
        })
        .catch(function (error) { console.log(error); });
}




function hideInfoBlocks() {
    const weatherInfoBox = document.querySelector('.weather-info-box');
  
    if (weatherInfoBox) weatherInfoBox.style.display = 'none';
}

function showWikiModal(){
    $('#wikiModal').modal('show');
}

document.getElementById('search-form').addEventListener('submit', handleFormSubmit);
document.getElementById('search-input').addEventListener('input', handleInput);
document.getElementById('open-modal-link').addEventListener('click', function(event) {
    event.preventDefault();
    showWikiModal();
});

document.getElementById('open-gallery-modal').addEventListener('click', function(event) {
    event.preventDefault();
    const title = 'London'; 
    getWikiImage(title);
    $('#galleryModal').modal('show');
});
