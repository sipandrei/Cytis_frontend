const connectButton = document.querySelector("#connect");
const disconnectButton = document.querySelector("#disconnect");
const currentPressure = document.querySelector("#current-pressure");
const pressureInput = document.querySelector("#pressure-input");
const setForm = document.querySelector("#pressure-form");
const getButton = document.querySelector("#get-pressure");
const terminalContainer = document.querySelector("#terminal");

let deviceCache = null;
let characteristicCache = null;

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

function connectDeviceAndCacheCharacteristic(device) {
  if (device.gatt.connected && characteristicCache) {
    return Promise.resolve(characteristicCache);
  }

  log("Connecting to Gatt server...");

  return device.gatt
    .connect()
    .then((server) => {
      log("GATT server connected, getting service...");

      return server.getPrimaryService(0xffe0);
    })
    .then((service) => {
      log("Service found, getting characteristic...");

      return service.getCharacteristic(0xffe1);
    })
    .then((characteristic) => {
      log("Characteristic found");
      characteristicCache = characteristic;

      return characteristicCache;
    });
}

function startNotifications(characteristic) {
  log("Starting notifications...");

  return characteristic.startNotifications().then(() => {
    log("Notifications started");
  });
}

function log(data, type = "") {
  terminalContainer.insertAdjacentHTML(
    "beforeend",
    "<div" + (type ? ' class="' + type + '"' : "") + ">" + data + "</div>"
  );
}

function disconnect() {}

function send(value) {}
