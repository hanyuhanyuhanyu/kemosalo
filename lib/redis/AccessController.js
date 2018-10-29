const redis = require('redis');
const {promisify} = require('util');
const keystore = 30
        
const createToken = () => {
  const codes = [];
  for(let i = 0; i < 32; i++){
    codes.push(Math.floor(Math.random() * 26) + (Math.floor(Math.random() * 2) ? 65 : 97));
  }
  return String.fromCharCode(...codes);
}

const execute = (func) => {
  return new Promise(async (resolve, reject) => {
    const client = redis.createClient();
    client.on("error", function(err){
      console.log(err);
      reject(err)
    })
    const result = await func(client)
    client.quit();
    resolve(result);
  })
}

const createKey async () => {
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
  useKey: async (socket, emit) => {
    const [key, val] = await createKey();
    socket.emit(emit, key, val, ...arguments, (data) => deleteKey(key))
  },
  collateKey: (key, val) => {
    return execute(async (client) => {
      const v = promisify(client.get).bind(client)(key)
      return v === val
    })
  }
}
