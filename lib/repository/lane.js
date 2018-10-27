const AbstractRepository = require('./AbstractRepository.js');
const lbls = require('../enums/lane_type.js');

const master_lbl = lbls.master
const slave_lbl = lbls.slave

module.exports = class extends AbstractRepository {
  async add(address, master=false, name=null){
    const kind = master ? master_lbl : slave_lbl;
    const nm = name ? name : 'john doe';
    return await this.run('insert into lane (ip, kind, name) values (?, ?, ?)', address, kind, nm);
  }
  async getMaster(){
    const lanes = await this.all('select * from lane where kind=?', master_lbl);
    return lanes[0];
  }
  async findByAddress(address){
    const lanes = await this.all('select * from lane where ip=?', address)
    return lanes[0];
  }
  async getAll(){
    return await this.all('select * from lane')
  }
}
