export default class LaneStatus {
  constructor(ip, name, kind){
    this.ip = ip
    this.name = name
    this.kind = kind
    this.alive = undefined
    this.time = null
  }
  connectionStatus(){
    return this.alive ? "正常" : "異常"
  }
  timems(){
    if(!this.time){
      return '----'
    }
    return this.time + ' ms'
  }
  access(time){
    this.alive = true
    this.time = time
  }
  disconnect(){
    this.alive = false
  }
}
