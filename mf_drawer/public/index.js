document.addEventListener('DOMContentLoaded', function() {
    const showAllVideosButton = document.getElementById('showAllVideos');
    const showFavoritesButton = document.getElementById('showFavorites');
    const favoriteCountElement = document.getElementById('favoriteCount');
    let favorites = [];

    function navigate(path) {
        history.pushState({}, '', path);
        route(path);
    }

    function route(path) {
        if (path === '/videos') {
            window.parent.postMessage({ type: 'showAllVideos' }, '*');
        } else if (path === '/favorites') {
            window.parent.postMessage({ type: 'showFavorites' }, '*');
        }
    }

    function getFavorites() {
        return fetch('http://localhost:3000/favorites')
            .then(response => response.json())
            .catch(error => console.error('Erro ao obter favoritos', error));
    }

    function updateFavoriteCount() {
        getFavorites().then(favorites => {
            favoriteCountElement.textContent = `${favorites.length}`;
        }).catch(error => console.error('Erro ao atualizar contador de favoritos', error));
    }

    showAllVideosButton.addEventListener('click', function(event) {
        event.preventDefault();
        navigate('/videos');
    });

    showFavoritesButton.addEventListener('click', function(event) {
        event.preventDefault();
        navigate('/favorites');
    });

    document.addEventListener('favoritesChanged', function(event) {
        favorites = event.detail.favorites;
        updateFavoriteCount();
    });

    window.addEventListener('popstate', function() {
        route(window.location.pathname);
    });

    updateFavoriteCount();
    route(window.location.pathname);
});
