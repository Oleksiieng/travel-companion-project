(function () {
    const apiKey = 'addd5a1a8efb42c9ad97ecfd8f615f6c';
    let selectedPlaceId = null;
    
    function handleFormSubmit(event) {
        event.preventDefault();
        const isHotelChecked = document.getElementById('option-hotel').checked;
        const isRestaurantChecked = document.getElementById('option-restaurant').checked;
    
        const categories = [];
        if (isHotelChecked) categories.push('accommodation.hotel');
        if (isRestaurantChecked) categories.push('catering.restaurant');
    
        getPlaceDetails(selectedPlaceId, categories.join(',')).then(places => {
            createBootstrapTable(places);
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
            .then(data => jsonData = data.features);
    }
    

    function createBootstrapTable(data) {
        console.log(data);
        let tableContent = '<table class="table"><thead><tr><th>Name</th><th>Address</th><th>Categories</th></tr></thead><tbody>';
    
        data.forEach(item => {
            tableContent += `<tr><td>${item.properties.name}</td><td>${item.properties.formatted}</td><td>${item.properties.categories.join(', ')}</td></tr>`;
        });
    
        tableContent += '</tbody></table>';
    
        document.getElementById('results-table').innerHTML = tableContent;
    }
    

    document.getElementById('search-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('search-input').addEventListener('input', handleInput);

})();