export default class Log {
  constructor(obj){
    this.id = obj.sequential_id || Math.floor(Math.random() * 1000000000);
    this.ip = obj.ip || null
    this.name = obj.name || null
    this.card = obj.card || null
    this.time = obj.time || null
    this.error = obj.error || null
    this.user = obj.user || null
  }
}

