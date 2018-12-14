const config = require("../config.js");
const onOff = require("./OnOff.js");
const onShutdown = require('../onShutdown.js');

var onSwitchHandler;

function setOnSwitchHandler(handler) {
  onSwitchHandler = handler;
}

function onSwitchChange(name, err, value) {
  if (!onSwitchHandler) return;
  onSwitchHandler(name, err, value);
}

function makeInSwitch(name, gpioNo) {
  return {
    button: new onOff(gpioNo, 'in', 'both'),
    name: name,
    direction: "in"
  }
}

function makeOutSwitch(name, gpioNo) {
  return {
    button: new onOff(gpioNo, 'out'),
    name: name,
    direction: "out"
  }
}

var inSwitches = Object.entries(config.switches_in || {}).map(kp => makeInSwitch(kp[0], kp[1]));
var outSwitches = Object.entries(config.switches_out || {}).map(kp => makeOutSwitch(kp[0], kp[1]));
var switchesByName = inSwitches.concat(outSwitches).reduce(
  (a, v) => {
    a[v.name] = v;
    return a;
  }, {});
inSwitches.forEach(v => {
  v.button.watch((err, value) => setOnSwitchHandler(v.name, err, value))
});

function checkValue(name) {
  var gpioSwitch = switchesByName[name];
  return gpioSwitch && gpioSwitch.button ? gpioSwitch.button.readSync() : undefined;
}

function setValue(name, value) {
  var gpioSwitch = switches[name];
  if (gpioSwitch == undefined) throw "Unknown Switch ${name}";
  if (gpioSwitch.direction !== "out") throw "Switch ${name} is not setable (input only)";
  gpioSwitch.button.writeSync(value);
}

onShutdown(() => {
  Object.entries(switchesByName).forEach(
    s => s[1].button.unexport());
}, "GPIO Switches")


module.exports = {
  OnSwitch: setOnSwitchHandler,
  CheckValue: checkValue,
  SetValue: setValue,
  InputSwitchNames: inSwitches.map(value => value.name),
  OutputSwitchNames: outSwitches.map(value => value.name),
  InputSwitchValues: inSwitches.map(value => ({name: value.name, state: checkValue(value.name)})),
  OutputSwitchValues: outSwitches.map(value => ({name: value.name, state: checkValue(value.name)})),
};