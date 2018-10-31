const express = require('express');
const router = express.Router();
const PassageService = require('../lib/service/PassageService.js');
const LaneService = require('../lib/service/LaneService.js');
const WebSocket = require('../lib/websocket/websocket.js');

const passService = new PassageService();
const laneService = new LaneService();
const webSocket = new WebSocket();

router.get('/', async function(req, res, next) {
  try{
    const message = await passService.getAll();
    res.status(200);
    res.send(message.object);
  } catch(e){
    console.log(e)
    res.status(500)
    res.send();
  }
});
router.get('/all', async function(req, res, next) {
  try{
    const message = await laneService.getAll();
    res.status(200);
    res.send(message.object);
  } catch(e) {
    console.log(e);
    res.status(500);
    res.send();
  }
})
router.get('/history/:card', async function(req, res, next) {
  try {
    const message = await passService.findByCard(req.params.card);
    res.status(200)
    res.send(message.object)
  } catch (e){
    console.log(e)
    res.status(500);
    res.send();
  }
});
router.post('/pass/master', async function(req, res, next) {
  const card = req.body.card;
  const lane = req.body.lane;
  const message = await passService.accessMaster(card, lane);
  if(message.isErr){
    res.status(message.httpCode);
    webSocket.masterPassFailed([lane, card]);
  } else {
    res.status(200);
    webSocket.masterPass([lane, card]);
  }
  res.send(message.object)
})
router.post('/pass/slave/:lane', async function(req, res, next) {
  //validationしよう！　な！
  const card = req.body.card;
  const lane = req.params.lane;
  const message = await passService.accessSlave(card, lane);
  if(message.isErr){
    res.status(message.httpCode)
    webSocket.slavePassFailed([lane, card])
  } else {
    res.status(200)
    webSocket.slavePass([lane, card])
  }
  res.send()
})

module.exports = router;

