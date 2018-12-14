let isWindows = process.env.OS="Windows_NT";
var onOff
if (isWindows){
  onOff = require('./FakeGpio.js')
}
else {
  onOff = require('onoff').Gpio;
}
module.exports = onOff;