const io = require('socket.io-client');
const socket = io(`ws://127.0.0.1:3000`);
const access = require('../redis/AccessController.js');

module.exports = class{
  constructor(){
  }
  masterPass(){
    access.emitWithKey(socket, 'masterPass')
  }
  masterPassFailed(){
    access.emitWithKey(socket, 'masterPassFailed')
  }
  slavePass(lane){
    access.emitWithKey(socket, 'slavePass', lane)
  }
  slavePassFailed(lane){
    access.emitWithKey(socket, 'slavePassFailed', lane)
  }
}
