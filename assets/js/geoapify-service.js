export const apiKey = 'addd5a1a8efb42c9ad97ecfd8f615f6c';

export function fetchGeoapifyData(query) {
    return fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${apiKey}`)
        .then(response => response.json());
}