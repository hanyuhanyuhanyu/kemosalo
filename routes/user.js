const express = require('express');
const router = express.Router();
const UserService = require('../lib/service/userService.js')
const WebSocket = require('../lib/websocket/websocket.js');

const userService = new UserService();
const webSocket = new WebSocket();

router.get('/read/:id/:card', async function(req, res, next){
  const id = req.params.id
  const card = req.params.card
  const data = await userService.findByCard(card)
  console.log(data)
  if(data.length > 0){
    res.status(400)
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
    let returnMessage = ''
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


