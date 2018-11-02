const History = require('../repository/history.js');
const Message = require('../util/messenger.js');
const Lane = require('../repository/lane.js');
const lbls = require('../enums/lane_type.js');

const master_lbl = lbls.master
const slave_lbl = lbls.slave

module.exports = class {
  constructor(){
    this.lane = new Lane();
  }
  async getAll(){
    const message = new Message();
    message.object = await this.lane.getAll();
    return message
  }
  async findByAddress(address){
    const message = new Message();
    message.object = await this.lane.findByAddress(address);
    return message
  }
}
