const input = document.getElementById('search-input');
const suggestions = document.getElementById('suggestions');

input.addEventListener('input', function() {
    const value = this.value;

    if (value.length < 3) {
        suggestions.style.display = 'none';
        return;
    }

    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&apiKey=addd5a1a8efb42c9ad97ecfd8f615f6c`)
        .then(response => response.json())
        .then(data => {
            suggestions.innerHTML = '';
            data.features.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.properties.formatted;
                li.onclick = function() {
                    input.value = item.properties.formatted;
                    suggestions.style.display = 'none';
                };
                suggestions.appendChild(li);
            });
            suggestions.style.display = 'block';
        });
});