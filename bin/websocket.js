const Lanes = require('../lib/repository/lane.js');
const pingCmd = require('../lib/util/pingCommand.js');
const collateFunc = require('../lib/redis/AccessController.js').collateKey;
const idhost = require('../lib/redis/SocketIdController.js');
const getIds = async () => {
  return await idhost.retrieve();
}
const collate = async (key, val) => {
  return await collateFunc(key, val)
}

module.exports = function(io){
  io.on('connection', function(socket){
    let lanes = new Lanes();
    let pingCmdIds = [];
    let pinged = false;
    console.log('user connected');
    socket.on('initialize', async () => {
      if(pinged){
        console.log('pinged twice')
        return;
      }
      pinged = true;
      console.log(socket.id)
      idhost.add(socket.id);
      const l = await lanes.getAll();
      l.forEach(lane => {
        setInterval(async () => {
          try{
            console.log(`send ping to ${lane.ip}`)
            const ret = await pingCmd(lane.ip)
            const address = ret.match(/(\d{1,3}\.){3}\d{1,3}/)[0];
            const time = ret.match(/\d+\.?\d+(?=\sms)/)[0];
            socket.emit('connectionAscertained', address, time)
          } catch(e) {
            socket.emit('connectionLost', lane.ip)
          }
        }, 5000)
      })
    })
    socket.on('masterPass', async (key, val) => {
      if(!await collate(key, val)){
        return 
      }
      const ids = await getIds()
      ids.forEach(id => socket.to(id).emit('masterPass'))
    })
    socket.on('masterPassFailed', async (key, val) => {
      if(!await collate(key, val)){
        return 
      }
      const ids = await getIds()
      ids.forEach(id => socket.to(id).emit('masterPassFailed'))
    })
    socket.on('slavePass', async (key, val, lane) => {
      if(!await collate(key, val)){
        return 
      }
      const ids = await getIds()
      ids.forEach(id => socket.to(id).emit('slavePass', lane))
    })
    socket.on('slavePassFailed', async (key, val, lane) => {
      if(!await collate(key, val)){
        return 
      }
      const ids = await getIds()
      ids.forEach(id => socket.to(id).emit('slavePassFailed', lane))
    })
    socket.on('disconnect', () => {
      pingCmdIds.forEach(p => clearInterval(p))
      pinged = false;
      idhost.remove(socket.id)
    })
  })
  return io
}
