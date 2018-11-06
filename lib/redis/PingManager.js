const {promisify} = require('util');
const {execute} = require('./Util.js');

const key = "ping_interval_id"
const counter = "ping_interval_counter"
module.exports = {
  doing: async () => {
    return execute(async (client) => {
      const get = promisify(client.get).bind(client)
      return await get(counter)
    })
  },
  startPing: () => {
    return execute((client) => {
      client.incr(counter, (err, rep) => {
        if(err){
          throw err
        }
      })
    })
  },
  finishPing: async () => {
    return execute(async (client) => {
      const get = promisify(client.get).bind(client)
      const con = await get(counter)
      if(con !== '0'){
        client.decr(counter)
        return null
      }
      const ret = await client(key)
      client.del(key, (err, rep) => {
        if(err){
          throw err
        }
      })
      client.del(counter, (err, rep) => {
        if(err){
          throw err
        }
      })
      return ret;
    })
  }
}
