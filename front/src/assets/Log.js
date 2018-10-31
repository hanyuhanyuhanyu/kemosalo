export default class Log {
  constructor(id, ip, card, error = null){
    this.id = id
    this.ip = ip
    this.card = card
    this.error = error
  }
}

