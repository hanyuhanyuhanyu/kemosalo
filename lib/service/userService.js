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
      if(!!card){
        this.user.update(req)
        return;
      }
      if(!req.name || req.name.match(/^\s*$/)){
        message.error('空白名は受け付けられません', 400)
        return message
      }
      await this.user.add(req)
    } catch(e) {
      console.log(e)
      message.error('DBサーバがへん', 500)
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

