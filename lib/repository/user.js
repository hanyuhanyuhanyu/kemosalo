const AbstractRepository = require('./AbstractRepository.js');

module.exports = class extends AbstractRepository {
  async add(req){
    return await this.run('insert into user (card_id, name) values (?, ?)', req.card, req.name)
  }
  async findByCard(card){
    const res = await this.all('select * from user where card_id=?', card)
    return res[0]
  }
  async getAll(){
    return await this.all('select * from user')
  }
}

