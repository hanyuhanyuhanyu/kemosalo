const Lanes = require('../lib/repository/lane.js');
const pingCmd = require('../lib/util/pingCommand.js');
const collateFunc = require('../lib/redis/AccessController.js').collateKey;
const pingManager = require('../lib/redis/PingManager.js');
const collate = async (key, val) => {
  return await collateFunc(key, val)
}
const ping = 'ping'
const watchdog = 'watchdog'
const cardReader = 'cardReader'

let pingCmdIds = null;
// let pinged = 0;

module.exports = function(io){
  io.on('connection', async function(socket){
    let lanes = new Lanes();
    console.log('user connected');
    socket.on('watchdogInitialize', async () => {
      socket.join(watchdog);
      socket.join(ping);
      if(await pingManager.doing()){
        console.log('skip fire ping command')
        return;
      }
      const l = await lanes.getAll();

      const intervalId = setInterval(async () => {
        l.forEach(async lane => {
          try{
            console.log(`send ping to ${lane.ip}`)
            const ret = await pingCmd(lane.ip)
            const address = ret.match(/(\d{1,3}\.){3}\d{1,3}/)[0];
            const time = ret.match(/\d+\.?\d+(?=\sms)/)[0];
            io.to(ping).emit('connectionAscertained', address, time)
          } catch(e) {
            io.to(ping).emit('connectionLost', lane.ip)
          }
        })
      }, 5000)
      pingManager.startPing();
      pingCmdIds = intervalId
    })
    socket.on('mainSignageInitialize', () => {
      socket.join(watchdog)
    })
    socket.on('cardReaderInitialize', async () => {
      socket.join(cardReader)
    })
    socket.on('masterPass', async (key, val, obj) => {
      if(!await collate(key, val)){
        return 
      }
      io.to(watchdog).emit('masterPass', obj);
    })
    socket.on('masterPassFailed', async (key, val, obj) => {
      if(!await collate(key, val)){
        return 
      }
      io.to(watchdog).emit('masterPassFailed', obj);
    })
    socket.on('slavePass', async (key, val, obj) => {
      if(!await collate(key, val)){
        return 
      }
      io.to(watchdog).emit('slavePass', obj);
    })
    socket.on('slavePassFailed', async (key, val, obj) => {
      if(!await collate(key, val)){
        return 
      }
      io.to(watchdog).emit('slavePassFailed', obj);
    })
    socket.on('cardRead', async(key, val,obj) => {
      if(!await collate(key, val)){
        return
      }
      io.to(cardReader).emit('cardRead', obj)
    })
    socket.on('disconnect', () => {
      const p = pingManager.finishPing()
      clearInterval(pingCmdIds);
    })
  })
  return io
}
