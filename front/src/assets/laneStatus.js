export default class LaneStatus {
  constructor(ip, name, kind){
    this.ip = ip
    this.name = name
    this.kind = kind
    this.alive = undefined
    this.time = null
  }
  access(time){
    this.alive = true
    this.time = time
  }
  disconnect(){
    this.alive = false
  }
}
