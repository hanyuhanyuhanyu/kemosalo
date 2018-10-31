const io = require('socket.io-client');
const socket = io(`ws://127.0.0.1:3000`);
const access = require('../redis/AccessController.js');

module.exports = class{
  constructor(){
  }
  masterPass(arr){
    access.emitWithKey(socket, 'masterPass', arr)
  }
  masterPassFailed(arr){
    access.emitWithKey(socket, 'masterPassFailed', arr)
  }
  slavePass(arr){
    access.emitWithKey(socket, 'slavePass', arr)
  }
  slavePassFailed(arr){
    access.emitWithKey(socket, 'slavePassFailed', arr)
  }
}
