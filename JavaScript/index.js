const APIKEY = 'hpWd6JPs0tVTz4TVIOvoPo6H8pi9Elsy';

const themePicker = document.getElementsByClassName("theme-picker")[0];
themePicker.addEventListener('change', () => {
  // 1 - Obtener el valor seleccionado
const selectedTheme = themePicker.value;

  // 2 - Obtener el elemento body
const body = document.getElementsByTagName('body')[0];

  // 3 - Sacar la clase actual y poner la clase seleccionada
body.className= selectedTheme;

});




function getSearchResults(search) {
    const found =
    fetch(`http://api.giphy.com/v1/gifs/search?q=${encodeURI(search)}&api_key=${APIKEY}`)
    .then((response) => {
    return response.json()
    })
    .catch((error) => {
    console.error(error);
    })
    return found
    };

function getSearch(){
   let searchResults = document.getElementById("search")
   return searchResults.value
};


const buttonSearch = document.getElementsByClassName("btn-search") [0];

buttonSearch.addEventListener('click', function (){
    getSearchResults(getSearch()).then (response=>{
       const gifs = response.data;
       const boxGifs = document.getElementById("giphy");
       gifs.forEach(gif => { 
           const image = document.createElement ("img");
           image.src = gif.images.original.url;
           image.alt = gif.title;
        boxGifs.appendChild (image);
       });
    })
});


