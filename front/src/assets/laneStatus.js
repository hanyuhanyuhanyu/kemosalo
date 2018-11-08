export default class LaneStatus {
  constructor(ip, name, kind){
    this.ip = ip
    this.name = name
    this.kind = kind
    this.alive = undefined
    this.time = null
  }
  connectionStatus(){
    let ret = "正常"
    switch(this.alive){
      case true:
        return '正常'
      case false:
        return '異常'
      case undefined:
        return '調査中…'
    }
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
