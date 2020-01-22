const APIKEY = "hpWd6JPs0tVTz4TVIOvoPo6H8pi9Elsy";

let RandomArray = ["mean girls", "puppies", "spongebob", "television"];

function getRandomResults() {
  let tag = 0;
  for (i = 0; i < 4; i++) {
    fetchRandomGif(tag);
    tag++;
  }
}

function fetchRandomGif(tag) {
  fetch(
    `http://api.giphy.com/v1/gifs/random?api_key=${APIKEY}&tag=${RandomArray[tag]}`
  )
    .then(response => {
      return response.json();
    })

    .then(response => {
      let gif = response.data.images.fixed_width.url;
      console.log(gif);
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
  const found = fetch(
    `http://api.giphy.com/v1/gifs/trending?api_key=${APIKEY}&limit=16`
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

function createTrendingItem(gif) {
  let fixed_height = gif.images.fixed_height;
  let className = "trending-item";
  if (fixed_height.width > 280){
    className = className + " trending-item-wide"
  }
  const trendingItemContainer = document.createElement("div");
  trendingItemContainer.className = className;
  const imageTrending = document.createElement("img");
  imageTrending.src = gif.images.fixed_height.url;
  imageTrending.alt = gif.title;
  trendingItemContainer.appendChild(imageTrending);
  const footer = document.createElement("footer");
  footer.innerText = gif.title;
  footer.className = "trending-header";
  trendingItemContainer.appendChild(footer);
  return trendingItemContainer;
}

function buscarSugerencia(sugerencia) {
  let searchResults = document.getElementById("search");
  searchResults.value = sugerencia;
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

let sugeridosVisibles = false;
let eventoCerrarSugeridos = null;

function limpiarSugeridos() {
  const divBusqueda = document.getElementById("placeholder-search");
  divBusqueda.innerHTML = null;
  sugeridosVisibles = false;
}

function mostrarSugeridos() {
  const inputSearch = document.getElementById("search");
  inputSearch.oninput = e => {
    if (!sugeridosVisibles) {
      const templateBusqueda = document.getElementById("busquedas-template");
      const divBusqueda = document.getElementById("placeholder-search");
      divBusqueda.innerHTML = templateBusqueda.innerHTML;
      eventoCerrarSugeridos = window.addEventListener("click", function() {
        limpiarSugeridos();
        window.removeEventListener(eventoCerrarSugeridos);
      });
      sugeridosVisibles = true;
    }
  };
}

mostrarSugeridos();

function createThemeSelect(selectedValue) {
  const selectName = document.createElement("DIV");
  selectName.setAttribute("class", "theme-select");
  selectName.innerHTML = selectedValue;
  return selectName;
}

function findSelectedOptionIndex(selectBoxClick, value) {
  for (let j = 0; j < selectBoxClick.options.length; j++) {
    if (selectBoxClick.options[j].innerHTML == value) {
      return j;
    }
  }
}

function seleccionarOption() {
  const selectBoxClick = this.parentNode.parentNode.getElementsByTagName(
    "select"
  )[0];
  const selectOptionsClick = this.parentNode.previousSibling;

  const selectedOptionIndex = findSelectedOptionIndex(
    selectBoxClick,
    this.innerHTML
  );

  const selectedOption = selectBoxClick.options[selectedOptionIndex];

  selectBoxClick.selectedIndex = selectedOptionIndex;
  selectOptionsClick.innerHTML = this.innerHTML;
  const selectClass = this.parentNode.getElementsByClassName(
    "same-as-selected"
  );
  for (let k = 0; k < selectClass.length; k++) {
    selectClass[k].removeAttribute("class");
  }
  this.setAttribute("class", "same-as-selected");

  setBodyTheme(selectedOption.value);

  selectOptionsClick.click();
}

function createDivOption(selectOption) {
  const selectOptions = document.createElement("DIV");
  selectOptions.innerHTML = selectOption.innerHTML;
  selectOptions.addEventListener("click", seleccionarOption);

  return selectOptions;
}

function ConfigurarTeamPicker() {
  const selectBox = document.getElementsByClassName("select-box")[0];
  const selElmnt = selectBox.getElementsByTagName("select")[0];
  const selectName = createThemeSelect(
    selElmnt.options[selElmnt.selectedIndex].innerHTML
  );
  selectBox.appendChild(selectName);

  const selectItems = document.createElement("DIV");
  selectItems.setAttribute("class", "select-options select-hide");
  for (let i = 1; i < selElmnt.options.length; i++) {
    const selectOption = selElmnt.options[i];
    const optionElement = createDivOption(selectOption);
    selectItems.appendChild(optionElement);
  }

  selectBox.appendChild(selectItems);
  selectName.addEventListener("click", function(e) {
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x,
    y,
    i,
    arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

function setBodyTheme(selectedTheme) {
  // 1 - Obtener el elemento body
  const body = document.getElementsByTagName("body")[0];

  // 2 - Sacar la clase actual y poner la clase seleccionada
  body.className = selectedTheme;
}

ConfigurarTeamPicker();
