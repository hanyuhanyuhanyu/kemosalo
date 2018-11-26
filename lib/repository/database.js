const sqlite3 = require('sqlite3').verbose();
module.exports = function accessDB() {
  const testing = process.env.KEMOSALO_TEST;
  return new sqlite3.Database(testing === 'TESTING' ? 'history.sqlite3' : 'test.sqlite3');
}

