const AbstractRepository = require('./AbstractRepository.js');
const lbls = require('../enums/lane_type.js');

const master_lbl = lbls.master
const slave_lbl = lbls.slave

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
    return await this.all('select * from history left outer join lane on history.lane_id=lane.ip ' + order + ' limit ?', limit);
  }
  async findByCard(cardId, slaveOnly = true, limit = 5, desc = true){
    let where = ' where card_id=? '
    const args = [cardId];
    if(slaveOnly){
      where += ' and kind=?'
      args.push(slave_lbl)
    }
    let sql = 'select * from history left outer join lane on history.lane_id=lane.ip' + where +' order by time';
    if(desc){
      sql += ' desc';
    }
    if(limit > 0){
      sql += ' limit ?';
      args.push(limit);
    }
    return await this.all(sql, ...args);
  }
}
