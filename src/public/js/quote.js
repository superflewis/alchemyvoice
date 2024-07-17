
document.addEventListener('DOMContentLoaded', () => {
    const quoteButton = document.getElementById('get-quote');

    quoteButton.addEventListener('click', () => {
        fetch('/api/quotes/random')
            .then(response => response.json())
            .then(data => {
                const quoteElement = document.getElementById('quote');
                quoteElement.innerText = data.quote;
            })
            .catch(error => {
                console.error('Error fetching quote:', error);
            });
    });
});
