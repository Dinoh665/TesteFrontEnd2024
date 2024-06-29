document.addEventListener('DOMContentLoaded', function() {
    const favoritesCountSpan = document.getElementById('favorites-count')
    let favoritesCount = 0

    function updateFavoritesCount() {
        favoritesCountSpan.textContent = favoritesCount
    }

    document.addEventListener('toggleFavorite', function(event) {
        favoritesCount += event.detail.add ? 1 : -1
        updateFavoritesCount()
    })

    window.navigate = function(section) {
        if(section === 'videos') {
            window.location.href = 'http://localhost:3002'
        } else if (section === 'favorites') {
            alert('Navegar para favoritos')
        }
    }
    
    updateFavoritesCount()
})
