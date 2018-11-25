const express = require('express');
const router = express.Router();
const CardService = require('../lib/service/CardService.js')
const UserService = require('../lib/service/userService.js')
const WebSocket = require('../lib/websocket/websocket.js');

const cardService = new CardService();
const userService = new UserService();
const webSocket = new WebSocket();

router.get('/read/:card', async function(req, res, next) {
  try{
    const card = await userService.findByCard(req.params.card);
    if(!card){
      res.status(404);
      res.send('このカードは未登録です')
      return
    }
    const histories = await cardService.getAllHistories(req.params.card);
    res.status(200);
    webSocket.broadcastCardHistory({
      name: card.name,
      card: req.params.card,
      histories: histories.object
    })
    res.send('ok')
  } catch(e){
    console.log(e)
    res.status(500)
    res.send('サーバエラー');
  }
});

module.exports = router;


