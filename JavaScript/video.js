const APIKEY = "hpWd6JPs0tVTz4TVIOvoPo6H8pi9Elsy";
const apiUrl = "http://upload.giphy.com/v1/gifs";
const idApi = "https://api.giphy.com/v1/gifs/";
let recorder;
let blobs;
let video = document.getElementById("video");
let PlayVideo = document.getElementById("video-upload");
let videoBlob;
let gifBlob;
let blob;
let countDownDate;
const gifUpload = document.getElementById("saved-gifs");

function confTema() {
  let tema = localStorage.getItem("tema");
  if (tema === "dark") {
    changeThemeDark();
  } else {
    changeThemePrincipal();
  }
}
confTema();

function startVideo() {
  openVideo();
  getVideoAndRecord();
}

function AddClass(Selector, ClassName) {
  document.getElementById(Selector).classList.add(ClassName);
}
function RemoveClass(Selector, ClassName) {
  document.getElementById(Selector).classList.remove(ClassName);
}

const queryString = window.location.search;
let modo = new URLSearchParams(queryString).get("modo"); //
if (!modo) {
  modo = "crear";
}

if (modo === "crear") {
  renderizarModoCrear();
} else {
  renderizarModoMisGifos();
}

function openVideo() {
  const divCrear = document.getElementsByClassName("CrearGifos")[0];
  const divMisGifos = document.getElementsByClassName("CrearGifs")[0];
  const TemplateVideo = document.getElementById("video-record");
  const divVideo = document.getElementsByClassName("video-div")[0];
  divVideo.innerHTML = TemplateVideo.innerHTML;
  divMisGifos.innerHTML = null;
  divCrear.innerHTML = null;
}

function getVideoAndRecord() {
  video = document.getElementById("video");
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        width: { ideal: 832 },
        height: { ideal: 434 }
      }
    })

    .then(function(stream) {
      video.srcObject = stream;
      recorder = new MRecordRTC(stream, {
        video: "video/webm",
        gif: "image/gif",
        disableLogs: true
      });

      recorder.mediaType = {
        audio: false,
        video: true,
        gif: true
      };

      video.play();
    })

    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}

async function StartRecordButton() {
  this.disabled = true;
  AddClass("button-record", "display-none");
  RemoveClass("btn-stop-recording", "display-none");
  const buttonStop = document.getElementById("btn-stop-recording");
  buttonStop.disabled = false;
  RemoveClass("button-play", "show");
  AddClass("button-play", "hide");
  AddClass("title-1", "display-none");
  RemoveClass("title-2", "display-none");
  AddClass("title-2", "font-nav");
  countDownDate = new Date().getTime();

  try {
    recorder.startRecording();
  } catch (e) {
    console.error("No se pudo iniciar la grabacion", e);
  }
}

function stopRecordButton() {
  recorder.stopRecording(function() {
    video.classList.add("display-none");
    PlayVideo = document.getElementById("video-upload");
    PlayVideo.classList.remove("display-none");
    blobs = recorder.getBlob();
    videoBlob = blobs.video;
    gifBlob = blobs.gif;
    Time();

    try {
      PlayVideo.src = window.URL.createObjectURL(videoBlob);
    } catch (err) {
      console.error(err);
    }
    AddClass("title-2", "display-none");
    RemoveClass("title-3", "display-none");
    AddClass("title-3", "font-nav");
    AddClass("btn-stop-recording", "display-none");
    RemoveClass("button-play", "hide");
    RemoveClass("button-send", "display-none");
    AddClass("button-send", "botones-enviar-gif");
    video.srcObject.getTracks().forEach(function(track) {
      track.stop();
    });
  });
}

function uploadGif() {
  RemoveClass("subiendo", "display-none");
  AddClass("subiendo", "Cargar-items");
  AddClass("video-upload", "display-none");
  RemoveClass("button-send", "botones-enviar-gif");
  AddClass("button-send", "display-none");
  RemoveClass("btn-cancel", "display-none");
  AddClass("btn-cancel", "btn-cancel");

  setTimeout(
    function() {
      const divVideo = document.getElementsByClassName("video-div")[0];
      const divUpload = document.getElementById("div-upload");
      divVideo.innerHTML = divUpload.innerHTML;
      let previewVideo = document.getElementById("preview-video");
      previewVideo.src = window.URL.createObjectURL(videoBlob);
      renderizarModoMisGifos();
    },

    8000
  );

  let form = new FormData();
  form.append("file", gifBlob, "myGif.gif");
  form.append("api_key", APIKEY);
  form.append("tags", "tags");
  console.log(form.get("file"));
  let URL = `${apiUrl}?api_key=${APIKEY}`;
  const params = {
    method: "POST",
    body: form,
    json: true
  };

  const found = fetch(URL, params)
    .then(response => {
      return response.json();
    })
    .then(datos => {
      saveGifLocalStorage(datos.data.id);
    })

    .catch(error => {
      console.log(error);
      return error;
    });
  return found;
}

function repeatRecording() {
  RemoveClass("subiendo", "Cargar-items");
  AddClass("subiendo", "display-none");
  RemoveClass("video-upload", "display-none");
  RemoveClass("btn-cancel", "btn-cancel");
  AddClass("btn-cancel", "display-none");
  recorder.destroy();
  recorder = null;
  startVideo();
}

function cancelUpload() {
  console.log("se cancela la subida");
  location.reload();
}

function renderizarModoCrear() {
  const templateCrear = document.getElementById("new-gifOs");
  const divCrear = document.getElementsByClassName("CrearGifos")[0];
  divCrear.innerHTML = templateCrear.innerHTML;
  renderizarModoMisGifos();
}

function renderizarModoMisGifos() {
  const templateMisGuifos = document.getElementById("Mis-gifos");
  const divMisGifos = document.getElementsByClassName("CrearGifs")[0];
  divMisGifos.innerHTML = templateMisGuifos.innerHTML;

  const Gallery = document.getElementById("gallery");
  let gifos = getGifsFromLocalStorage();
  // por cada url construir un elemento donde se vea ese gif
  const gifosElements = gifos.map(gifo => buildGifoElement(gifo));

  Gallery.append(...gifosElements);
}

function buildGifoElement(gifo) {
  const gifoContainer = document.createElement("div");
  gifoContainer.className = "gifo-img";
  const imgGifo = document.createElement("img");
  imgGifo.src = gifo;
  gifoContainer.appendChild(imgGifo);
  return gifoContainer;
}

function changeThemeDark() {
  const themeDark = document.getElementById("dark");
  const themePrincipal = document.getElementById("principal");
  themePrincipal.classList.remove("selected");
  themeDark.classList.add("selected");
  const body = document.getElementsByTagName("body")[0];
  let selectedTheme = themeDark.value;
  body.className = selectedTheme;
  localStorage.setItem("tema", "dark");
}

function changeThemePrincipal() {
  const themePrincipal = document.getElementById("principal");
  const themeDark = document.getElementById("dark");
  themePrincipal.classList.add("selected");
  themeDark.classList.remove("selected");
  const body = document.getElementsByTagName("body")[0];
  let selectedTheme = themePrincipal.value;
  body.className = selectedTheme;
  localStorage.setItem("tema", "principal");
}

function Dropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function Time() {
  if (!recorder) {
    return;
  }

  document.getElementById("set-time").innerText = calculateTime(
    (new Date().getTime() - countDownDate) / 1000
  );
}

function calculateTime(segundos) {
  var hr = Math.floor(segundos / 3600);
  var min = Math.floor((segundos - hr * 3600) / 60);
  var seg = Math.floor(segundos - hr * 3600 - min * 60);

  if (min < 10) {
    min = "0" + min;
  }

  if (seg < 10) {
    seg = "0" + seg;
  }

  if (hr <= 0) {
    return "00" + ":" + min + ":" + seg;
  }

  return hr + ":" + min + ":" + seg;
}

function saveGifLocalStorage(id) {
  fetch(`${idApi}${id}?api_key=${APIKEY}`)
    .then(response => {
      return response.json();
    })
    .then(dataGif => {
      let url = dataGif.data.images.fixed_height.url;
      let Gifs = getGifsFromLocalStorage();
      Gifs.push(url);
      localStorage.setItem("gifList", JSON.stringify(Gifs));
    });
}

function getGifsFromLocalStorage() {
  const localStorageItem = localStorage.getItem("gifList");
  return localStorageItem ? JSON.parse(localStorageItem) : [];
}

function endGif() {
  window.location.replace("crearGifOs.html?modo=misgifos");
}
