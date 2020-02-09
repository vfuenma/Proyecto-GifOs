let recorder;
let video = document.getElementById("video");
let PlayVideo = document.getElementById("video-upload");

function startVideo() {
  openVideo();
  getVideoAndRecord();
}

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
      recorder = RecordRTC(stream, {
        type: "video/webm",
        disableLogs: true
      });

      video.play();
    })

    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}

async function StartRecordButton() {
  this.disabled = true;
  const buttonStart = document.getElementsByClassName("btn-record")[0];
  buttonStart.classList.add("display-none");
  const buttonStop = document.getElementById("btn-stop-recording");
  buttonStop.disabled = false;
  buttonStop.classList.remove("display-none");
  const divBotones = document.getElementsByClassName("botones-grabar")[0];
  divBotones.classList.remove("show");
  divBotones.classList.add("hide");
  const titleRecorder1 = document.getElementById("title-1");
  const titleRecorder2 = document.getElementById("title-2");
  titleRecorder1.classList.add("display-none");
  titleRecorder2.classList.remove("display-none")
  titleRecorder2.classList.add("font-nav")

  try {

      recorder.startRecording();
      recorder.camera = stream;
  
  } catch (e) {
    console.error("No se pudo iniciar la grabacion", e);
  }
}

 function stopRecordButton() {
  recorder.stopRecording(function() {
    video.classList.add("display-none");
    PlayVideo = document.getElementById("video-upload");
    PlayVideo.classList.remove("display-none");
    let blob = recorder.getBlob();
    PlayVideo.src = window.URL.createObjectURL(blob);

  });
}

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
