const express = require('express');
const router = express.Router();
const UserService = require('../lib/service/userService.js')
const PassageService = require('../lib/service/PassageService.js')
const WebSocket = require('../lib/websocket/websocket.js');

const userService = new UserService();
const passageService = new PassageService();
const webSocket = new WebSocket();

router.get('/', async function(req, res, next){
  try{
    const ret = await userService.getAll()
    res.send(ret)
  } catch(e) {
    console.log(e)
    res.status(500)
    res.send('サーバエラー');
  }
})
router.get('/:card', async function(req, res, next){
  try{
    const card = await userService.findByCard(req.params.card)
    console.log(card)
    if(!card){
      res.status(404)
      res.send('このカードは未登録です')
      return
    }
    const ret = await passageService.findByCard(req.params.card, false, -1);
    res.send(ret.object)
  } catch(e){
    console.log(e)
    res.status(500)
    res.send('サーバエラー');
  }
})
router.get('/read/:id/:card', async function(req, res, next){
  const id = req.params.id
  const card = req.params.card
  const data = await userService.findByCard(card)
  if(data){
    res.status(400)
    webSocket.notBlankCardRead({id, card, data});
    res.send('このカードはすでに登録されています（ブランクではない）')
    return
  }
  webSocket.blankCardRead({id, card});
  res.status(200)
  res.send('read')
})
router.post('/register', async function(req, res, next) {
  try{
    const result = await userService.register(req.body)
    let returnMessage = req.body.name
    let statusCode = 200
    if(result.isErr){
      returnMessage = result.message
      statusCode = result.httpCode
    }
    res.status(statusCode)
    res.send(returnMessage)
  } catch(e){
    console.log(e)
    res.status(500)
    res.send('サーバエラー');
  }
});

module.exports = router;


