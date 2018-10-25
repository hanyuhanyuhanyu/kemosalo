const History = require('../repository/history.js').repository;
const Lane = require('../repository/lane.js').repository;
const lbls = require('../enums/lane_type.js').labels;

const master_lbl = lbls.master
const slave_lbl = lbls.slave

module.exports = {
  service: class {
    constructor(){
      this.history = new History();
      this.lane = new Lane();
    }
    async accessGate(cardId, lane, kind){
      return kind === master_lbl ? this.accessMaster(cardId, lane) : this.accessSlave(cardId, lane)
    }
    async accessMaster(cardId, lane){
      if((await this.lane.findByAddress(lane)).length === 0){
        return null;
      }
      await this.history.add(cardId, lane)
      return this.history.findByCard(cardId)
    }
    accessSlave(cardId, lane){
      if((await this.lane.findByAddress(lane)).length === 0){
        return null;
      }
      this.history.add(cardId, lane)
    }
  }
}
