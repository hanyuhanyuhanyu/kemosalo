const Lanes = require('../lib/repository/lane.js');
const pingCmd = require('../lib/util/pingCommand.js');
module.exports = function(io){
  io.on('connection', function(socket){
    let lanes = new Lanes();
    let pinged = false;
    let pingCmdIds = [];
    console.log('user connected');
    socket.on('pingThem', async () => {
      if(pinged){
          console.log('pinged twice')
        return;
      }
      pinged = true;
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
    socket.on('masterPass', (key, value) => {

    })
    socket.on('disconnect', () => {
      pingCmdIds.forEach(p => clearInterval(p))
    })
  })

  return io
}
