const API_URL = 'http://localhost:3000/search';
const FAVORITES_URL = 'http://localhost:3000/favorites';
const apiKey = 'AIzaSyBYqx-CCXxxgp0CqRElEN_66Evg1VVLeA4'; // Defina sua apiKey aqui

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
        if (typeof window !== 'undefined') {
            document.dispatchEvent(event);
        }
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
            saveFavorites(favorites)
                .then(() => {
                    // Atualiza a estrela imediatamente após salvar os favoritos
                    if (typeof window !== 'undefined') {
                        const starButton = document.querySelector(`button[data-video-id="${videoId}"]`);
                        if (starButton) {
                            starButton.textContent = favorites.includes(videoId) ? '⭐' : '☆';
                        }
                    }
                });
        })
        .catch(error => console.error('Erro ao alternar favorito', error));
}

function updateFavoriteCount() {
    getFavorites()
        .then(favorites => {
            if (typeof window !== 'undefined') {
                const favoriteCountElement = document.getElementById('favoriteCount');
                if (favoriteCountElement) {
                    favoriteCountElement.textContent = `${favorites.length}`;
                }
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
    if (typeof window !== 'undefined') {
        const videoResults = document.getElementById('videoResults');
        if (videoResults) {
            videoResults.innerHTML = '';

            getFavorites().then(favorites => {
                videos.forEach(video => {
                    const videoElement = document.createElement('div');
                    videoElement.className = 'video';
                    const isFav = favorites.includes(video.id.videoId);
                    videoElement.innerHTML = `
                        <iframe width="420" height="236" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
                        <div id="title">
                            <div id="star">
                                <button data-video-id="${video.id.videoId}" onclick="toggleFavorite('${video.id.videoId}')">${isFav ? '⭐' : '☆'}</button>
                            </div>
                            <h3>${video.snippet.title}</h3>
                        </div>
                    `;
                    videoResults.appendChild(videoElement);
                });
            });
        }
    }
}

function displayFavorites() {
    if (typeof window !== 'undefined') {
        getFavorites().then(favorites => {
            const videoResults = document.getElementById('videoResults');
            if (videoResults) {
                videoResults.innerHTML = '';

                if (favorites.length === 0) {
                    videoResults.innerHTML = '<p>Nenhum vídeo favorito encontrado.</p>';
                    return;
                }

                favorites.forEach(videoId => {
                    fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`)
                        .then(response => response.json())
                        .then(data => {
                            const video = data.items[0];
                            const videoElement = document.createElement('div');
                            videoElement.className = 'video';
                            videoElement.innerHTML = `
                                <iframe width="420" height="236" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                                <div id="title">
                                    <div id="star">
                                        <button data-video-id="${videoId}" onclick="toggleFavorite('${videoId}')">⭐</button>
                                    </div>
                                    <h3>${video.snippet.title}</h3>
                                </div>
                            `;
                            videoResults.appendChild(videoElement);
                        })
                        .catch(error => {
                            console.error('Erro ao buscar informações do vídeo', error);
                        });
                });
            }
        }).catch(error => console.error('Erro ao exibir favoritos', error));
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('message', function(event) {
        if (event.data.type === 'showAllVideos') {
            searchVideos('');
        } else if (event.data.type === 'showFavorites') {
            displayFavorites();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                const searchInput = document.getElementById('searchInput');
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    searchVideos(searchTerm);
                }
            });
        }
        updateFavoriteCount();
    });
}

module.exports = {
    searchVideos, // Exportando a função searchVideos
};
