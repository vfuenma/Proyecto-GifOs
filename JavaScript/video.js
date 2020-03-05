const APIKEY = "hpWd6JPs0tVTz4TVIOvoPo6H8pi9Elsy";
const apiUrl = "http://upload.giphy.com/v1/gifs";
let recorder;
let blobs;
let video = document.getElementById("video");
let PlayVideo = document.getElementById("video-upload");
let videoBlob;
let gifBlob;
let blob;
let countDownDate;


function confTema(){
  let tema = localStorage.getItem("tema");
  if (tema === "dark"){
    changeThemeDark()
  }else{
    changeThemePrincipal();
  }
};
confTema();


function startVideo() {
  openVideo();
  getVideoAndRecord();
}
// Agregar y quitar clases
function AddClass(Selector, ClassName) {
  document.getElementById(Selector).classList.add(ClassName);
}
function RemoveClass(Selector, ClassName) {
  document.getElementById(Selector).classList.remove(ClassName);
}

//Mostrar o no Crear Guifos
const queryString = window.location.search;
let modo = new URLSearchParams(queryString).get("modo"); // puede ser 'crear' o 'misgifos' o nada
if (!modo) {
  modo = "crear";
}

if (modo === "crear") {
  renderizarModoCrear();
} else {
  renderizarModoMisGifos();
}

//Abrir el video

function openVideo() {
  const divCrear = document.getElementsByClassName("CrearGifos")[0];
  const divMisGifos = document.getElementsByClassName("CrearGifs")[0];
  const TemplateVideo = document.getElementById("video-record");
  const divVideo = document.getElementsByClassName("video-div")[0];
  divVideo.innerHTML = TemplateVideo.innerHTML;
  divMisGifos.innerHTML = null;
  divCrear.innerHTML = null;
}

//Obtener el video y grabar
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
        audio: false, // or StereoAudioRecorder
        video: true, // or WhammyRecorder
        gif: true // or GifRecorder
      };

      video.play();
    })

    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}

//parar la grabación
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

//Vista previa de video
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
  });
}

function uploadGif() {
  RemoveClass("subiendo", "display-none");
  AddClass("subiendo", "Cargar-items");
  AddClass("video-upload", "display-none");
  RemoveClass("button-send","botones-enviar-gif" )
  AddClass("button-send", "display-none");
  
  // console.log(gifBlob);
  let form = new FormData();
  form.append("file", gifBlob, "myGif.gif");
  form.append("api_key", APIKEY);
  form.append("tags", "tags");
  console.log(form.get("file"));
  let URL = `${apiUrl}?api_key=${APIKEY}`;
  const params = {
    method: "POST",
    body: form,
    json: true,
    // mode: 'no-cors'
  };

  const found = fetch(URL, params)
    .then(response => {
      return response.json();
    })
    .then(datos => {
      // guandarGifLocalStorage(datos.data.id);
    })

    .catch(error => {
      console.log(error);
      return error;
    });
  return found;
}

// function cancelarSubida() {
//   console.log("se cancela la subida");
//   //escondo el cartel de subida
//   mostEsconComponet(document.getElementById("cartel-subida"), esconder);

//   //llamo a la funcion que recaptura
//   vistaPreviaVideo();
//   recapturar();
// }

function renderizarModoCrear() {
  const templateCrear = document.getElementById("new-gifOs");
  const templateMisGuifos = document.getElementById("Mis-gifos");
  const divCrear = document.getElementsByClassName("CrearGifos")[0];
  const divMisGifos = document.getElementsByClassName("CrearGifs")[0];
  divCrear.innerHTML = templateCrear.innerHTML;
  divMisGifos.innerHTML = templateMisGuifos.innerHTML;
}

function renderizarModoMisGifos() {
  const templateMisGuifos = document.getElementById("Mis-gifos");
  const divMisGifos = document.getElementsByClassName("CrearGifs")[0];
  divMisGifos.innerHTML = templateMisGuifos.innerHTML;
}


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
  };
  
  function Dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  
  };


  function Time() {
    if (!recorder) {
        return;
    }

    document.getElementById('set-time').innerText = calculateTime((new Date().getTime() - countDownDate) / 1000);

    // setTimeout(Time, 1000);

}

function calculateTime(segundos) {

  // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  // var seconds = Math.floor((distance % (1000 * 60)) / 1000);


    var hr = Math.floor(segundos / 3600);
    var min = Math.floor((segundos - (hr * 3600)) / 60);
    var seg = Math.floor(segundos - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0"  + min;
    }

    if (seg < 10) {
        seg = "0"  + seg;
    }

    if (hr <= 0) {
        return "00" + ':' + min + ':' + seg;
    }

    return hr + ':' + min + ':' + seg;
}


  

// function guandarGifLocalStorage(id) {
//   //traigo el gif conpleto con este id
//   fetch(buscarProId + id + '?' + '&api_key=' + apiKey)
//       .then(response => {
//           return response.json();
//       })
//       .then(dataGif => {

//           let url = dataGif.data.images.downsized.url
//               //guardar en elnace en el boton
//           document.getElementById("btn-copiEnla").setAttribute("value", url);

//           //me fijo si hay algo guardado
//           if (localStorage.getItem('GifList')) {
//               //me traigo lo que hay en el llocal storage
//               misGif = JSON.parse(localStorage.getItem('GifList'));
//               // le agrego el nuevo valor
//               misGif.push(url);
//               //lo guardo de nuevo
//               localStorage.setItem('GifList', JSON.stringify(misGif));
//           } else {
//               misGif.push(url);
//               localStorage.setItem('GifList', JSON.stringify(misGif));
//           }
//       });
// }
