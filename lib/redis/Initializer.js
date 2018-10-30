const {execute} = require('./Util.js');

module.exports = () => {
  execute((client) => {
    client.flushdb();
  })
}

