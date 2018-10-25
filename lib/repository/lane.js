const AbstractRepository = require('./AbstractRepository.js').cls;
const lbls = require('../enums/lane_type.js').labels;

const master_lbl = lbls.master
const slave_lbl = lbls.slave

module.exports = {
  repository: class extends AbstractRepository {
    async add(address, master=false, name=null){
      const kind = master ? master_lbl : slave_lbl;
      const nm = name ? name : 'john doe';
      return await this.run('insert into lane (ip, kind, name) values (?, ?, ?)', address, kind, nm);
    }
    async findByAddress(address){
      return await this.all('select * from lane where ip=?', address);
    }
  }
}

