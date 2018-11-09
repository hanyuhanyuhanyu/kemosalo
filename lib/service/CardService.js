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
  async getAllHistories(card){
    const message = new Message();
    message.object = await this.history.findByCard(card, false, 0)
    return message
  }
}

