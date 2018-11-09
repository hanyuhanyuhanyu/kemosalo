const express = require('express');
const router = express.Router();
const CardService = require('../lib/service/CardService.js')
const WebSocket = require('../lib/websocket/websocket.js');

const cardService = new CardService();
const webSocket = new WebSocket();

router.get('/read/:card', async function(req, res, next) {
  try{
    const histories = await cardService.getAllHistories(req.params.card);
    //本来ならカードの存在チェックをすべきだがマスターテーブルがないため不能
    res.status(200);
    webSocket.broadcastCardHistory({
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


