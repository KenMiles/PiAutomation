const http = require('http');
const config = require("./config.js");
const switches = require("./gpio/Switch.js");
const onShutdown = require("./onShutdown.js");
const readSensor = require("./gpio/ReadSensor.js");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

const dao = require("./dao/sensorLogDao.js")

function SensorReader() {
  let readings = readSensor.readAll();
  readings.forEach(r => {
    console.log(`${r.name} ${r.reading.temperature} ${r.reading.humidity}`);
    dao.RecordSensor(r.name, r.reading.temperature, r.reading.humidity);
  });
  let switchValues = switches.InputSwitchValues.concat(switches.OutputSwitchValues);
  switchValues.forEach(value => dao.RecordSwitchStatus(value.name, value.state));
}

var timer = setInterval(SensorReader, config.sensor_check_seconds * 1000);
SensorReader();

onShutdown(() => {
  clearInterval(timer);
  server.close();
}, "Server")

server.listen(config.server_port, config.host_name, () => {
  console.log(`Server running at http://${config.host_name}:${config.server_port}/`);
});
