const db = require('./database.js').accessDB;

module.exports = {
  cls: class {
    constructor(){
      this.db = null
    }
    getDb(){
      if(!this.db){
        this.db = db();
      }
      return this.db
    }
    async all(){
      return new Promise((resolve, reject) => {
        const sql = arguments[0]
        this.getDb().all(sql, ...Array.prototype.slice.call(arguments, 1), (err, rows) => {
          if(err){
            reject(err)
          }
          resolve(rows)
        })
      })
    }
    async run(){
      return new Promise((resolve, reject) => {
        const sql = arguments[0]
        this.getDb().run(sql, ...Array.prototype.slice.call(arguments, 1), (err) => {
          if(err){
            reject(err)
          }
          resolve()
        })
      })
    }
  }
}
