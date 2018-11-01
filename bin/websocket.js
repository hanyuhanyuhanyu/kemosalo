const Lanes = require('../lib/repository/lane.js');
const pingCmd = require('../lib/util/pingCommand.js');
const collateFunc = require('../lib/redis/AccessController.js').collateKey;
const collate = async (key, val) => {
  return await collateFunc(key, val)
}
const pingRoom = 'pingRoom'

let pingCmdIds = [];
let pinged = 0;

module.exports = function(io){
  io.on('connection', function(socket){
    let lanes = new Lanes();
    console.log('user connected');
    socket.on('initialize', async () => {
      socket.join(pingRoom);
      if(pinged > 0){
        console.log('pinged twice')
        return;
      }
      pinged++;
      const l = await lanes.getAll();
      l.forEach(lane => {
        const intervalId = setInterval(async () => {
          try{
            console.log(`send ping to ${lane.ip}`)
            const ret = await pingCmd(lane.ip)
            const address = ret.match(/(\d{1,3}\.){3}\d{1,3}/)[0];
            const time = ret.match(/\d+\.?\d+(?=\sms)/)[0];
            io.to(pingRoom).emit('connectionAscertained', address, time)
          } catch(e) {
            io.to(pingRoom).emit('connectionLost', lane.ip)
          }
        }, 5000)
        pingCmdIds.push(intervalId);
      })
    })
    socket.on('masterPass', async (key, val, ip, card) => {
      if(!await collate(key, val)){
        return 
      }
      console.log(ip, card)
      io.emit('masterPass', ip, card);
    })
    socket.on('masterPassFailed', async (key, val, ip, card) => {
      if(!await collate(key, val)){
        return 
      }
      console.log(ip, card)
      io.emit('masterPassFailed', ip, card);
    })
    socket.on('slavePass', async (key, val, ip, card) => {
      if(!await collate(key, val)){
        return 
      }
      console.log(ip, card)
      io.emit('slavePass', ip, card);
    })
    socket.on('slavePassFailed', async (key, val, ip, card) => {
      if(!await collate(key, val)){
        return 
      }
      console.log(ip, card)
      io.emit('slavePassFailed', ip, card);
    })
    socket.on('disconnect', () => {
      pinged--;
      if(pinged === 0){
        pingCmdIds.forEach(p => clearInterval(p))
      }
    })
  })
  return io
}
