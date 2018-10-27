const exec = require('child_process').exec
module.exports = async function ping(ip, timeout = 5){
  return new Promise((resolve, reject) => {
    timeout = parseInt(timeout);
    if(!Number.isInteger(timeout)){
      reject('timeout must be number');
    }
    exec(`ping -c 1 -w ${timeout} ${ip} | grep "64\\sbytes\\sfrom"` , (err,out,serr) => {
      if(err){
        reject(err);
      }
      resolve(out);
    })
  })
}
