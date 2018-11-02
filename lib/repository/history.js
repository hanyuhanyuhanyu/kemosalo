const AbstractRepository = require('./AbstractRepository.js');
const lbls = require('../enums/lane_type.js');

const master_lbl = lbls.master
const slave_lbl = lbls.slave
const basicSelector = 'select sequential_id, card_id, datetime(time, "+9 hours") as time , lane_id as ip , lane.name as lane_name '
const basicFrom = 'from history left outer join lane on history.lane_id=lane.ip ' 

module.exports = class extends AbstractRepository {
  async add(cardId, lane){
    try{
      await this.run('insert into history (card_id, lane_id) values (?, ?)', cardId, lane);
      return true;
    } catch(e) {
    }
  }                       
  async any(limit = 100, desc = true){
    const ord = desc ? 'desc' : '';
    const order = `order by time ${ord}, sequential_id ${ord}`;
    return await this.all(basicSelector + basicFrom + order + ' limit ?', limit);
  }
  async getLast(cardId){
    const logs = await this.all(basicSelector + basicFrom + 'where card_id=? order by time desc, sequential_id desc limit 1', cardId)
    return logs[0]
  }
  async findByCard(cardId, slaveOnly = true, limit = 5, desc = true){
    let where = 'where card_id=?'
    const args = [cardId];
    if(slaveOnly){
      where += ' and kind=? '
      args.push(slave_lbl)
    }
    const ord = desc ? 'desc' : 'asc';
    const order = `order by time ${ord}, sequential_id ${ord}` 
    let sql = basicSelector + basicFrom + where + order;
    if(limit > 0){
      sql += ' limit ?';
      args.push(limit);
    }
    return await this.all(sql, ...args);
  }
}
