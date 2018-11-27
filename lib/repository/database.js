const sqlite3 = require('sqlite3').verbose();
module.exports = function accessDB() {
  const testing = process.env.KEMOSALO_TEST;
  return new sqlite3.Database(testing === 'TESTING' ? 'test.sqlite3' : 'history.sqlite3');
}

