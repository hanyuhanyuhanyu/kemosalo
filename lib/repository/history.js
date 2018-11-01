const AbstractRepository = require('./AbstractRepository.js');
const lbls = require('../enums/lane_type.js');

const master_lbl = lbls.master
const slave_lbl = lbls.slave
const basicSelector = 'select sequental_id, card_id, datetime(time, "+9 hours") as time '

module.exports = class extends AbstractRepository {
  async add(cardId, lane){
    try{
      await this.run('insert into history (card_id, lane_id) values (?, ?)', cardId, lane);
      return true;
    } catch(e) {
      return false;
    }
  }                       
  async any(limit = 100, desc = true){
    const order = desc ? 'order by time desc' : 'order by time'
    return await this.all(basicSelector + 'from history left outer join lane on history.lane_id=lane.ip ' + order + ' limit ?', limit);
  }
  async findByCard(cardId, slaveOnly = true, limit = 5, desc = true){
    let where = ' where card_id=?'
    const args = [cardId];
    if(slaveOnly){
      where += ' and kind=?'
      args.push(slave_lbl)
    }
    let sql = basicSelector + 'from history left outer join lane on history.lane_id=lane.ip' + where +' order by time' ;
    if(desc){
      sql += ' desc';
    }
    if(limit > 0){
      sql += ' limit ?';
      args.push(limit);
    }
    console.log(sql)
    console.log(args)
    return await this.all(sql, ...args);
  }
}
