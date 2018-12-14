let shutdownRoutines = [];

var gracefulShutdown = function () {
  shutdownRoutines.forEach(value => {
    try{
      console.log(`closing '${value.description}'`);
      value.callback();
    }
    catch (e) {
      console.log(`closing '${value.description}' threw: ${e}`);
    }
  })
}


// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

function registerShutDownCallBack(callback, description){
  if (callback == undefined) return;
  if ( typeof callback !== "function") throw "Callback is Not a function";
  shutdownRoutines.push({callback: callback, description: description||callback});
}


module.exports = registerShutDownCallBack;