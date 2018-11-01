const History = require('../repository/history.js');
const Message = require('../util/messenger.js');
const Lane = require('../repository/lane.js');
const lbls = require('../enums/lane_type.js');

const master_lbl = lbls.master
const slave_lbl = lbls.slave

module.exports = class {
  constructor(){
    this.history = new History();
    this.lane = new Lane();
  }
  async getAll(limit = 100){
    const message = new Message();
    message.object = await this.history.any(limit);
    return message
  }
  async findByCard(card, limit = 5){
    const message = new Message();
    message.object = await this.history.findByCard(card, false, limit);
    return message;
  }
  async accessGate(cardId, lane, kind){
    return kind === master_lbl ? this.accessMaster(cardId, lane) : this.accessSlave(cardId, lane)
  }
  async accessMaster(cardId, lane){
    const message = new Message();
    const foundLane = await this.lane.getMaster();
    if(!foundLane){
      message.error('master lane not been found. it\'s critical problem', 500);
      return message
    }
    if(foundLane.ip !== lane){
      message.error('sent ip does not match master\'s ip', 400);
      return message;
    };
    await this.history.add(cardId, lane);
    message.object = await this.history.findByCard(cardId);
    return message;
  }
  async accessSlave(cardId, lane){
    const message = new Message();
    const foundLane = await this.lane.findByAddress(lane);
    if(!foundLane){
      message.error('such lane does not exists', 404);
      return message;
    }
    if(foundLane.kind === master_lbl){
      message.error('that\'s master lane, not slave', 400);
      return message;
    }
    if(this.history.add(cardId, lane)){
      return message;
    }
    message.error('something wrong happened in db', 500);
    return message;
  }
}
