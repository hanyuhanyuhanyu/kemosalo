const AbstractRepository = require('./AbstractRepository.js').cls;

module.exports = {
  repository: class extends AbstractRepository {
    async add(cardId, lane){
      return await this.run('insert into history (card_id, lane) values (?, ?)', cardId, lane);
    }
    async findByCard(cardId, limit = 5){
      return await this.all('select * from history where card_id=? order by time desc limit ?', cardId, limit,)
    }
  }
}
