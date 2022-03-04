const connectButton = document.querySelector("#connect");
const disconnectButton = document.querySelector("#disconnect");
const currentPressure = document.querySelector("#current-pressure");
const pressureInput = document.querySelector("#pressure-input");
const setForm = document.querySelector("#pressure-form");
const getButton = document.querySelector("#get-pressure");

currentPressure.innerText = 0;

connectButton.addEventListener("click", connect);
disconnectButton.addEventListener("click", disconnect);

setForm.addEventListener("submit", onSetPressure);

function onSetPressure(e) {
  e.preventDefault();
  send(pressureInput.value);
  pressureInput.value = "";
  pressureInput.focus();
}

function connect() {}

function disconnect() {}

function send(value) {}
