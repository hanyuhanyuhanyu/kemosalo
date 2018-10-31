const {promisify} = require('util');
const {execute} = require('./Util.js');

const createToken = () => {
  const codes = [];
  for(let i = 0; i < 32; i++){
    codes.push(Math.floor(Math.random() * 26) + (Math.floor(Math.random() * 2) ? 65 : 97));
  }
  return String.fromCharCode(...codes);
}

const createKey = async () => {
  return execute(async (client) => {
    let key = createToken();
    const get = promisify(client.get).bind(client)
    while(await get(key)){
      key = createToken();
    }
    const value = createToken();
    await promisify(client.set).bind(client)(key, value)
    return [key, value]
  })
}
const deleteKey = async (key) => {
  execute(async (client) => {
    promisify(client.del).bind(client)(key)
  })
}

module.exports = {
  emitWithKey: async (socket, emit, arr) => {
    const [key, val] = await createKey();
    setTimeout((key) => {
      deleteKey(key);
    }, 60000)
    if(!Array.isArray(arr)){
      arr = [arr]
    }
    socket.emit(emit, key, val, ...arr)
  },
  collateKey: (key, val) => {
    return execute(async (client) => {
      const v = await promisify(client.get).bind(client)(key)
      return v === val
    })
  }
}
