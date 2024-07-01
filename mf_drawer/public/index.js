document.addEventListener('DOMContentLoaded', function() {
    const showAllVideosButton = document.getElementById('showAllVideos');
    const showFavoritesButton = document.getElementById('showFavorites');
    const favoriteCountElement = document.getElementById('favoriteCount');
    const videoResultsElement = document.getElementById('videoResults');
    let favorites = [];

    function getFavorites() {
        return fetch('http://localhost:3000/favorites')
            .then(response => response.json())
            .catch(error => console.error('Erro ao obter favoritos', error));
    }
 
    function updateFavoriteCount() {
        getFavorites().then(favorites => {
            favoriteCountElement.textContent = `Favoritos: ${favorites.length}`;
        }).catch(error => console.error('Erro ao atualizar contador de favoritos', error));
    }

    function displayFavorites() {
        getFavorites().then(favorites => {
            videoResultsElement.innerHTML = '';
            favorites.forEach(videoId => {
                const videoElement = document.createElement('div');
                videoElement.className = 'video';
                videoElement.innerHTML = `
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                `;
                videoResultsElement.appendChild(videoElement);
            });
        }).catch(error => console.error('Erro ao exibir favoritos', error));
    }

    showAllVideosButton.addEventListener('click', function() {
        const event = new CustomEvent('showAllVideos');
        document.dispatchEvent(event);
    });

    showFavoritesButton.addEventListener('click', function() {
        displayFavorites();
    });

    document.addEventListener('favoritesChanged', function(event) {
        favorites = event.detail.favorites;
        updateFavoriteCount();
    });

    // Inicializa favoritos ao carregar a página
    getFavorites().then(fav => {
        favorites = fav;
        updateFavoriteCount();
    });
});
