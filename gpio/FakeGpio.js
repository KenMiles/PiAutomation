var values = {};
function gpioFake(pin, direction, actions){
  if (!(this instanceof gpioFake)) return new gpioFake(pin,  direction, actions)
  this.pin = pin;
  this.value = 1;
  values[pin] = this;
}

gpioFake.prototype.watch = function( callback){

}

gpioFake.prototype.writeSync = function(value){
  this.value = value;
}

gpioFake.prototype.readSync = function(){
  return this.value;
}


gpioFake.prototype.unexport = function(){

}


module.exports = gpioFake;