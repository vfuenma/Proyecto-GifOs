const APIKEY = "hpWd6JPs0tVTz4TVIOvoPo6H8pi9Elsy";
const randomUrl = "http://api.giphy.com/v1/gifs/random?";
const searchUrl = "http://api.giphy.com/v1/gifs/search?";
const trendingUrl = "http://api.giphy.com/v1/gifs/trending?";
let ArrSug = [];

function confTema(){
  let tema = localStorage.getItem("tema");
  if (tema === "dark"){
    changeThemeDark()
  }else{
    changeThemePrincipal();
  }
};
confTema();

RenderizarBusquedasPrevias();


function AddClass(Selector, ClassName) {
  document.getElementById(Selector).classList.add(ClassName);
}
function RemoveClass(Selector, ClassName) {
  document.getElementById(Selector).classList.remove(ClassName);
}

let RandomArray = ["mean girls", "puppies", "spongebob", "television"];

function getRandomResults() {
  let tag = 0;
  for (i = 0; i < 4; i++) {
    fetchRandomGif(tag);
    tag++;
  }
}

function fetchRandomGif(tag) {
  fetch(`${randomUrl}api_key=${APIKEY}&tag=${RandomArray[tag]}`)
    .then(response => {
      return response.json();
    })

    .then(response => {
      let gif = response.data.images.fixed_width.url;
      let name = "#" + RandomArray[tag];
      let gifTitle = response.data.title;
      renderRandomGif(gif, tag, name, gifTitle);
    })
    .catch(error => {
      console.error(error);
    });
}

function renderRandomGif(gif, tag, name, gifTitle) {
  const boxRandomGifs = document.getElementById(`sugerido-${tag}`);
  boxRandomGifs.src = gif;
  boxRandomGifs.alt = gifTitle;
  boxRandomGifs.parentElement.getElementsByTagName("p")[0].innerHTML = name;
}

getRandomResults();

function getTrendingResults() {
  const found = fetch(`${trendingUrl}api_key=${APIKEY}&limit=16`)
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

function createTrendingItem(gif) {
  let fixed_height = gif.images.fixed_height;
  let className = "trending-item";
  if (fixed_height.width > 280) {
    className = className + " trending-item-wide";
  }
  const trendingItemContainer = document.createElement("div");
  trendingItemContainer.className = className;
  const imageTrending = document.createElement("img");
  imageTrending.src = gif.images.fixed_height.url;
  imageTrending.alt = gif.title;
  trendingItemContainer.appendChild(imageTrending);
  const footer = document.createElement("footer");
  footer.innerText = gif.title;
  trendingItemContainer.appendChild(footer);
  return trendingItemContainer;
}

function buscarSugerencia(sugerencia) {
  let searchResults = document.getElementById("search");
  searchResults.value = sugerencia;
}

function getSearchResults(search) {
  const found = fetch(
    `${searchUrl}q=${encodeURI(search)}&api_key=${APIKEY}&lang="es"`
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
  let TextSearch = document.getElementById("search-text");
  TextSearch.innerHTML = searchResults.value;
  return searchResults.value;
}

const buttonSearch = document.getElementsByClassName("btn-search")[0];

buttonSearch.addEventListener("click", function() {
  const Search = getSearch();
  getSearchResults(Search).then(response => {
    agregarBusquedaPrevia(Search);
    const gifs = response.data;
    const boxGifs = document.getElementById("giphy");
    boxGifs.innerHTML = null;
    let trendingGifs = document.getElementById("trending-gifs");
    trendingGifs.innerHTML = null;
    let RandomGifs = document.getElementById("random");
    RandomGifs.innerHTML = null;
    RemoveClass("header-search", "display-none");
    AddClass("header-search", "header-section");
    gifs.forEach(gif => {
      const GiphyItem = createGiphyItem(gif);
      boxGifs.appendChild(GiphyItem);
    });
  });
});

function agregarBusquedaPrevia(Search){
  let BotonesSearch = getSearchFromLocalStorage();
  BotonesSearch.push(Search);
  const aGuardar = BotonesSearch.slice(-10);
  localStorage.setItem("BusquedasGuardadas", JSON.stringify(aGuardar));
  RenderizarBusquedasPrevias();
};

function createGiphyItem(gif) {
  let fixed_height = gif.images.fixed_height;
  let className = "trending-item";
  if (fixed_height.width > 280) {
    className = className + " giphy-item-wide";
  }
  const GiphyItemContainer = document.createElement("div");
  GiphyItemContainer.className = className;
  const imageSearch = document.createElement("img");
  imageSearch.src = gif.images.fixed_height.url;
  imageSearch.alt = gif.title;
  GiphyItemContainer.appendChild(imageSearch);
  const footer = document.createElement("footer");
  footer.innerText = gif.title;
  GiphyItemContainer.appendChild(footer);
  return GiphyItemContainer;
}

let sugeridosVisibles = false;
let eventoCerrarSugeridos = null;

function limpiarSugeridos() {
  const divBusqueda = document.getElementById("placeholder-search");
  divBusqueda.innerHTML = null;
  sugeridosVisibles = false;
  RemoveClass("btn-busq", "change")
  RemoveClass("btn-busq", "btn");
  RemoveClass("btn-busq", "font-color") 
  AddClass("btn-busq", "default")
}

function mostrarSugeridos() {
  const inputSearch = document.getElementById("search");
  inputSearch.oninput = e => {
    if (!sugeridosVisibles) {
      const templateBusqueda = document.getElementById("busquedas-template");
      const divBusqueda = document.getElementById("placeholder-search");
      divBusqueda.innerHTML = templateBusqueda.innerHTML;
      RemoveClass("btn-busq", "default")
      AddClass("btn-busq", "change")
      AddClass("btn-busq", "btn");
      AddClass("btn-busq", "font-color")    
      eventoCerrarSugeridos = window.addEventListener("click", function() {
        limpiarSugeridos();
        window.removeEventListener("click", eventoCerrarSugeridos);
      });
      sugeridosVisibles = true;
    }
  };
}

mostrarSugeridos();

function changeThemeDark(){
const themeDark = document.getElementById("dark");
const themePrincipal = document.getElementById("principal");
themePrincipal.classList.remove("selected");
themeDark.classList.add("selected");
const body = document.getElementsByTagName("body")[0];
let selectedTheme = themeDark.value;
body.className = selectedTheme;
localStorage.setItem("tema", "dark")
}

function changeThemePrincipal(){
  const themePrincipal = document.getElementById("principal");
  const themeDark = document.getElementById("dark");
  themePrincipal.classList.add("selected");
  themeDark.classList.remove("selected");
  const body = document.getElementsByTagName("body")[0];
  let selectedTheme = themePrincipal.value;
  body.className = selectedTheme;
  localStorage.setItem("tema", "principal")
}

function Dropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function RenderizarBusquedasPrevias(){
const divBotones = document.getElementById("seach-saved")
let busquedasPrevias = getSearchFromLocalStorage();
const botonesBusq = busquedasPrevias.map(busqueda => construirBoton(busqueda));
divBotones.innerHTML = null;
divBotones.append(...botonesBusq);
}

function getSearchFromLocalStorage() {
  const localStorageItem = localStorage.getItem("BusquedasGuardadas");
  return localStorageItem ? JSON.parse(localStorageItem) : [];
}

function construirBoton(busqueda) {
  const busquedaGuardada = document.createElement("button");
  busquedaGuardada.className = "btn-saved-search";
  busquedaGuardada.innerHTML = busqueda;
  busquedaGuardada.addEventListener("click", ()=> buscarSugerencia(busqueda));
  return busquedaGuardada;
}

