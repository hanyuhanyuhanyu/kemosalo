const sqlite3 = require('sqlite3').verbose();
module.exports = function accessDB() {
  return new sqlite3.Database('history.sqlite3');
}

