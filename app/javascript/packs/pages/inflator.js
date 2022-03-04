const connectButton = document.querySelector("#connect");
const disconnectButton = document.querySelector("#disconnect");
const currentPressure = document.querySelector("#current-pressure");
const pressureInput = document.querySelector("#pressure-input");
const setForm = document.querySelector("#pressure-form");
const getButton = document.querySelector("#get-pressure");

let deviceCache = null;

currentPressure.innerText = 0;

connectButton.addEventListener("click", connect);
disconnectButton.addEventListener("click", disconnect);

setForm.addEventListener("submit", onSetPressure);

function onSetPressure(e) {
  e.preventDefault();
  send(pressureInput.value);
  pressureInput.value = "";
}

function connect() {
  return (deviceCache ? Promise.resolve(deviceCache) : requestBluetoothDevice())
    .then((device) => connectDeviceAndCacheCharacteristic(device))
    .then((characteristic) => startNotifications(characteristic))
    .catch((error) => console.log(error));
}

function requestBluetoothDevice() {
  log("Requesting Bluetooth Device...");
  return navigator.bluetooth
    .requestDevice({
      filters: [{ services: [0xffe0] }],
    })
    .then((device) => {
      log(`\"${device.name}\" bluetooth device selected`);
      deviceCache = device;

      return deviceCache;
    });
}

function startNotifications() {}

function log(data, type = "") {}

function disconnect() {}

function send(value) {}
