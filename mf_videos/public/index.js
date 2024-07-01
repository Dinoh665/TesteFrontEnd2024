const API_URL = 'http://localhost:3000/search';
const FAVORITES_URL = 'http://localhost:3000/favorites';

function getFavorites() {
    return fetch(FAVORITES_URL)
        .then(response => response.json())
        .catch(error => console.error('Erro ao obter favoritos', error));
}

function saveFavorites(favorites) {
    return fetch(FAVORITES_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favorites })
    })
    .then(response => response.json())
    .then(() => {
        updateFavoriteCount();
        const event = new CustomEvent('favoritesChanged', { detail: { favorites } });
        document.dispatchEvent(event);
    })
    .catch(error => console.error('Erro ao salvar favoritos', error));
}

function toggleFavorite(videoId) {
    getFavorites()
        .then(favorites => {
            const index = favorites.indexOf(videoId);
            if (index === -1) {
                favorites.push(videoId);
            } else {
                favorites.splice(index, 1);
            }
            return saveFavorites(favorites);
        })
        .catch(error => console.error('Erro ao alternar favorito', error));
}

function updateFavoriteCount() {
    getFavorites()
        .then(favorites => {
            const favoriteCountElement = document.getElementById('favoriteCount');
            if (favoriteCountElement) {
                favoriteCountElement.textContent = `Favoritos: ${favorites.length}`;
            }
        })
        .catch(error => console.error('Erro ao atualizar contador de favoritos', error));
}

function searchVideos(searchTerm) {
    fetch(`${API_URL}?q=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            currentVideos = data;
            displayVideos(data);
        })
        .catch(error => console.error('Erro ao buscar vídeos', error));
}

let currentVideos = [];

function displayVideos(videos) {
    const videoResults = document.getElementById('videoResults');
    videoResults.innerHTML = '';

    getFavorites().then(favorites => {
        videos.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.className = 'video';
            const isFav = favorites.includes(video.id.videoId);
            videoElement.innerHTML = `
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
                <h3>${video.snippet.title}</h3>
                <button onclick="toggleFavorite('${video.id.videoId}')">${isFav ? '⭐' : '☆'}</button>
            `;
            videoResults.appendChild(videoElement);
        });
    });
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchVideos(searchTerm);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
    updateFavoriteCount();

    document.addEventListener('showAllVideos', function() {
        searchVideos('');
    });
});
