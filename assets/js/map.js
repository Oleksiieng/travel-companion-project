const apiKey = 'addd5a1a8efb42c9ad97ecfd8f615f6c';
const map = L.map('map').setView([1, 1], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value;

    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchInput)}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const coordinates = data.features[0].geometry.coordinates;
                const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
                map.setView([coordinates[1], coordinates[0]], 10);
            } else {
                alert('Location not found. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching location coordinates:', error);
        });
});