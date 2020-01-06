const APIKEY = "hpWd6JPs0tVTz4TVIOvoPo6H8pi9Elsy";

const themePicker = document.getElementsByClassName("theme-picker")[0];
themePicker.addEventListener("change", () => {
  // 1 - Obtener el valor seleccionado
  const selectedTheme = themePicker.value;

  // 2 - Obtener el elemento body
  const body = document.getElementsByTagName("body")[0];

  // 3 - Sacar la clase actual y poner la clase seleccionada
  body.className = selectedTheme;
});

function getRandomResults() {
  const found = fetch(
    `http://api.giphy.com/v1/gifs/random?api_key=${APIKEY}`
  )
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });
  return found;
}

const randomResults = [getRandomResults(),getRandomResults(),getRandomResults(),getRandomResults()];
Promise.all(randomResults).then(randomGifs => {
  const boxRandomGifs = document.getElementById("random");
  randomGifs.forEach(response => {
    const gif = response.data;
    const imageRandom = document.createElement("img");
    imageRandom.src = gif.images.fixed_width.url;
    imageRandom.alt = gif.title;
    boxRandomGifs.appendChild(imageRandom);
  });
});

function getTrendingResults() {
  const found = fetch(
    `http://api.giphy.com/v1/gifs/trending?api_key=${APIKEY}&limit=12`
  )
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });
  return found;
}

getTrendingResults().then(response => {
  const trendingGifs = response.data;
  const boxTrendingGifs = document.getElementById("trending");
  trendingGifs.forEach(gif => {
      const trendingItem = createTrendingItem(gif);
    
    boxTrendingGifs.appendChild(trendingItem);
  });
});

function createTrendingItem(gif){
    const trendingItemContainer = document.createElement('div');
    trendingItemContainer.className="trending-item"
    const imageTrending = document.createElement("img");
    imageTrending.src = gif.images.fixed_height.url;
    imageTrending.alt = gif.title;
    trendingItemContainer.appendChild(imageTrending)
    const footer = document.createElement('footer');
    footer.innerText = gif.title;
    footer.className = 'trending-header';
    trendingItemContainer.appendChild(footer)
    return trendingItemContainer;
}

function getSearchResults(search) {
  const found = fetch(
    `http://api.giphy.com/v1/gifs/search?q=${encodeURI(
      search
    )}&api_key=${APIKEY}&lang="es"`
  )
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });
  return found;
}

function getSearch() {
  let searchResults = document.getElementById("search");
  return searchResults.value;
}

const buttonSearch = document.getElementsByClassName("btn-search")[0];

buttonSearch.addEventListener("click", function() {
  getSearchResults(getSearch()).then(response => {
    const gifs = response.data;
    const boxGifs = document.getElementById("giphy");
    gifs.forEach(gif => {
      const image = document.createElement("img");
      image.src = gif.images.fixed_height.url;
      image.alt = gif.title;
      boxGifs.appendChild(image);
    });
  });
});
