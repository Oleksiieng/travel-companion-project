
(function () {
    const apiKey = 'addd5a1a8efb42c9ad97ecfd8f615f6c';

    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const cityName = document.getElementById('search-input').value;
        const isHotelChecked = document.getElementById('option-hotel').checked;
        const isRestaurantChecked = document.getElementById('option-restaurant').checked;

        getCityCoordinates(cityName)
            .then(coordinates => {
                if (coordinates) {
                    const categories = [];
                    if (isHotelChecked) categories.push('accommodation.hotel');
                    if (isRestaurantChecked) categories.push('catering.restaurant');

                    getPlaceDetails(coordinates.lat, coordinates.lon, categories.join(','))
                        .then(places => {
                            console.log(places);
                        });
                } else {
                    console.error('City not found');
                }
            });
    });


    function getPlaceDetails(lat, lon, categories) {
        return fetch(`https://api.geoapify.com/v2/place-details?lat=${lat}&lon=${lon}&categories=${categories}&apiKey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                console.log('===============')
                console.log(data);
                return data.results;
            });
    }


    function getCityCoordinates(cityName) {
        
        const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(cityName)}&format=json&apiKey=${apiKey}`;

        return fetch(geocodeUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.results && data.results.length > 0) {
                    
                    return {
                        lat: data.results[0].lat,
                        lon: data.results[0].lon
                    };
                } else {
                    return null;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return null;
            });
    }
})();