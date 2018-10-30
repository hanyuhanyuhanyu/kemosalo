const redis = require('redis');
const {promisify} = require('util');
const {execute} = require('./Util.js');
const idhost = 'kemosalo:websocket:idhost'
        
module.exports = {
  add: async (id) => {
    return execute((client) => {
      client.sadd(idhost, id)
    })
  },
  retrieve: async (id) => {
    return execute(async (client) => {
      return await promisify(client.smembers).bind(client)(idhost)
    })
  },
  remove: async (id) => {
    return execute((client) => {
      client.srem(idhost, id)
    })
  },
  isValid: (id) => {
    return execute(async (client) => {
      return await promisify(client.sismember).bind(client)(idhost, id)
    })
  },
}

