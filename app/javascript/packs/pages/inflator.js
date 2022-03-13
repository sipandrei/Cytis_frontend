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
getButton.addEventListener("click", getPressure);

function getPressure() {
  let value = "c";
  if (!deviceCache) return log("Please connect to device");
  if (!value || !characteristicCache) return;
  writeToCharacteristic(characteristicCache, value);
  console.log(value);
}

function onSetPressure(e) {
  e.preventDefault();
  if (!deviceCache) return log("Please connect to device");
  sendPressure(pressureInput.value);
  pressureInput.value = "0";
}

function connect() {
  if (!navigator.bluetooth) return log("Web Bluetooth not suported :(");
  return (deviceCache ? Promise.resolve(deviceCache) : requestBluetoothDevice())
    .then((device) => connectDeviceAndCacheCharacteristic(device))
    .then((characteristic) => startNotifications(characteristic))
    .catch((error) => log(error.message));
}

function requestBluetoothDevice() {
  log("Requesting Bluetooth Device...");
  return navigator.bluetooth
    .requestDevice({
      acceptAllDevices: true,
      optionalServices: [0xffe0],
    })
    .then((device) => {
      log(`\"${device.name}\" bluetooth device selected`);
      deviceCache = device;

      deviceCache.addEventListener(
        "gattserverdisconnected",
        handleDisconnection
      );

      return deviceCache;
    });
}

function handleDisconnection(event) {
  let device = event.target;

  log(
    `\"${device.name}\" bluetooth device disconnected, trying to reconnect...`
  );

  connectDeviceAndCacheCharacteristic(device)
    .then((characteristic) => startNotifications(characteristic))
    .catch((error) => log(error));
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
    })
    .catch((error) => log(error.message));
}

function startNotifications(characteristic) {
  log("Starting notifications...");

  return characteristic.startNotifications().then(() => {
    log("Notifications started");
    characteristic.addEventListener(
      "characteristicvaluechanged",
      handleCharacteristicValueChanged
    );
  });
}

function log(data, type = "") {
  try {
    terminalContainer.querySelector("p").innerText = data;
  } catch (error) {
    terminalContainer.querySelector("p").innerText = error;
  }
}

function disconnect() {
  if (deviceCache) {
    log(`Disconnecting from \"${deviceCache.name}\" bluetooth device...`);
    deviceCache.removeEventListener(
      "gattserverdisconnected",
      handleDisconnection
    );

    if (deviceCache.gatt.connected) {
      deviceCache.gatt.disconnect();
      log(`\"${deviceCache.name}\" bluetooth device disconnected`);
    } else
      log(`\"${deviceCache.name}\" bluetooth device is already disconnected`);
  }

  if (characteristicCache) {
    characteristicCache.removeEventListener(
      "characteristicvaluechanged",
      handleCharacteristicValueChanged
    );
    characteristicCache = null;
  }
  deviceCache = null;
}

function handleCharacteristicValueChanged(event) {
  let value = new TextDecoder().decode(event.target.value);
  value = value.split(" ");
  if (value[0] == "current") {
    currentPressure.innerText = value[1];
  } else {
    log("Invalid current pressure response");
    console.log(value);
  }
}

function sendPressure(value) {
  value = String(value);
  value = `setPressure ${value}`;
  if (!value || !characteristicCache) return;
  writeToCharacteristic(characteristicCache, value);
  console.log(value);
}

function writeToCharacteristic(characteristic, data) {
  characteristic.writeValue(new TextEncoder().encode(data));
}
