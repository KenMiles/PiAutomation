const config = require("../config.js");

var sensors = Object.entries(config.sensors || {}).map(kp => kp[1]).reduce((a,v) => {
  a[v.pin] = v.type;
  return a;
}, {});

function handleError(error, callback) {
  if (callback) callback(error, undefined, undefined);
  return {error: error};
}

var callCount = 0;
function read(sensorType, pin, callback){
  if (sensors[pin] == undefined) {
    return handleError(`No Data from Pin ${pin}`, callback);
  }
  if (sensors[pin] != sensorType) {
    return handleError(`Mismatch on Sensor Type ${sensorType}, expected ${sensors[pin]}`, callback);
  }
  var call = callCount++/10;
  if (callCount > 10) callCount = 0;
  if (callback) callback(undefined, pin + call, pin + 30 + call);
  return{
    temperature: pin + call,
    humidity: pin + 30 + call
  }
}

module.exports = {read: read};