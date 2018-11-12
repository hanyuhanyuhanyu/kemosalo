const User = require('../repository/user.js');
const Message = require('../util/messenger.js');

module.exports = class {
  constructor(){
    this.user = new User();
  }
  async register(req){
    const message = new Message()
    try{
      const card = await this.user.findByCard(req.card)
      if(card.length > 0){
        message.error('このカードは登録済みです', 400)
        return message
      }
      await this.user.add(req)
    } catch(e) {
      this.message.error('DBサーバがへん', 500)
    } finally {
      return message
    }
  }
  async findByCard(card){
    return await this.user.findByCard(card)
  }
  async getAll(){
    return await this.user.getAll();
  }
}

