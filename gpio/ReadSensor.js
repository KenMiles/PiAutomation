const config = require("../config.js");
var dhtSensor
let isWindows = process.env.OS="Windows_NT";
if (isWindows){
  dhtSensor = require('./FakeNodeDhtSensor.js')
}
else {
  dhtSensor = require('node-dht-sensor').Gpio;
}

var sensors = config.sensors || {};

function readSensor(name) {
   var sensor = sensors[name];
   if (sensor == undefined) return undefined;
   return dhtSensor.read(sensor.type, sensor.pin)
}

function readAllSensors() {
   return Object.entries(sensors).map(s => ({name: s[0], reading: readSensor(s[0])}))
}

module.exports = {
  readAll: readAllSensors,
  read: readSensor
}