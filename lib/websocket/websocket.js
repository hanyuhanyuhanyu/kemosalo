const io = require('socket.io-client');
const socket = io(`ws://127.0.0.1:3000`);
const access = require('../redis/AccessController.js');

module.exports = class{
  constructor(){
  }
  masterPass(obj){
    access.emitWithKey(socket, 'masterPass', obj)
  }
  masterPassFailed(obj){
    access.emitWithKey(socket, 'masterPassFailed', obj)
  }
  slavePass(obj){
    access.emitWithKey(socket, 'slavePass', obj)
  }
  slavePassFailed(obj){
    access.emitWithKey(socket, 'slavePassFailed', obj)
  }
  broadcastCardHistory(obj){
    access.emitWithKey(socket, 'cardRead', obj)
  }
  blankCardRead(obj){
    access.emitWithKey(socket, 'readBlankCard', obj)
  }
  notBlankCardRead(obj){
    access.emitWithKey(socket, 'readNotBlankCard', obj)
  }
}
