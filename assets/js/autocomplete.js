import { fetchGeoapifyData } from './path/to/geoapifyService.js';

(function () {
    const input = document.getElementById('search-input');
    const suggestions = document.getElementById('suggestions');

    input.addEventListener('input', function () {
        const value = this.value;

        if (value.length < 3) {
            suggestions.style.display = 'none';
            return;
        }

        fetchGeoapifyData(value)
            .then(data => {
                // Тело функции остается неизменным
            });
    });
})();