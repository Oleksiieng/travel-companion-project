(function () {
    const apiKey = 'addd5a1a8efb42c9ad97ecfd8f615f6c';
    let selectedPlaceId = null;
    let jsonData = [];

    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const isHotelChecked = document.getElementById('option-hotel').checked;
        const isRestaurantChecked = document.getElementById('option-restaurant').checked;

        if (!selectedPlaceId) {
            alert('Please select a location from the list');
            return;
        }

        const categories = [];
        if (isHotelChecked) categories.push('accommodation.hotel');
        if (isRestaurantChecked) categories.push('catering.restaurant');

        getPlaceDetails(selectedPlaceId, categories.join(','))
            .then(places => {

                console.log(places);
                createBootstrapTable(places);
            });
    });

    document.getElementById('search-input').addEventListener('input', function () {
        const value = this.value;
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
    });

    function getPlaceDetails(placeId, categories) {
        return fetch(`https://api.geoapify.com/v2/places?categories=${categories}&filter=place:${placeId}&limit=20&apiKey=${apiKey}`)
            .then(response => response.json())
            .then(data => data.results);
    }

    function createBootstrapTable(jsonData) {
        // Assuming jsonData is your JSON data
        let data = jsonData.features;
    
        // Start with an empty string for HTML content
        let tableContent = '';
    
        // Create the table headers
        tableContent += '<table class="table">';
        tableContent += '<thead><tr><th>Name</th><th>Address</th><th>Categories</th></tr></thead>';
        tableContent += '<tbody>';
    
        // Loop through each item in the JSON data
        data.forEach(item => {
            tableContent += '<tr>';
            tableContent += `<td>${item.properties.name}</td>`;
            tableContent += `<td>${item.properties.formatted}</td>`;
            tableContent += `<td>${item.properties.categories.join(', ')}</td>`;
            tableContent += '</tr>';
        });
    
        // Close the table tags
        tableContent += '</tbody></table>';
    
        document.getElementById('results-table').innerHTML = tableContent;
    }

})();