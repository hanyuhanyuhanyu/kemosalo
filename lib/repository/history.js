const AbstractRepository = require('./AbstractRepository.js').cls;
const lbls = require('../enums/lane_type.js').labels;

const master_lbl = lbls.master
const slave_lbl = lbls.slave

module.exports = {
  repository: class extends AbstractRepository {
    async add(cardId, lane){
      return await this.run('insert into history (card_id, lane_id) values (?, ?)', cardId, lane);
    }
    async findByCard(cardId, slaveOnly = true, limit = 5, desc = true){
      let sql = 'select * from history left outer join lane on history.lane=lane.ip where card_id=? order by time';
      if(slaveOnly){
        sql += ' and kind=?'
        args.push(slave_lbl)
      }
      const args = [cardId];
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
}
