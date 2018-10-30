const redis = require('redis');

module.exports = {
  execute: (func) => {
    return new Promise(async (resolve, reject) => {
      const client = redis.createClient();
      client.select(1);
      client.on("error", function(err){
        console.log(err);
        reject(err)
      })
      const result = await func(client)
      client.quit();
      resolve(result);
    })
  }
}
