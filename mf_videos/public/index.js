const API_URL = 'http://localhost:3000/search';

function searchVideos(searchTerm) {
    const maxResults = 10
    fetch(`${API_URL}?q=${searchTerm}`)  // Correção: era ?q-${searchTerm}, corrigido para ?q=${searchTerm}
    .then(response => response.json())
    .then(data => {
        displayVideos(data);
    })
    .catch(error => {
        console.error('Erro ao buscar videos', error);
    });
}

function displayVideos(videos) {
    const videoResults = document.getElementById('videoResults');
    videoResults.innerHTML = '';

    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.className = 'video';
        videoElement.innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
            <h3>${video.snippet.title}</h3>
            <button onclick="toggleFavorite('${video.id.videoId}')">⭐</button>
        `;
        videoResults.appendChild(videoElement);
    });
}

function toggleFavorite(videoId) {
    console.log('Toggling favorite for video:', videoId);
}

function handleSearch() {
    const searchInput = document.getElementById('search');
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
});
