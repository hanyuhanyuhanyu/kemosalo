const express = require('express');
const router = express.Router();
const PassageService = require('../lib/service/PassageService.js');
const UserService = require('../lib/service/userService.js');
const LaneService = require('../lib/service/LaneService.js');
const WebSocket = require('../lib/websocket/websocket.js');

const passService = new PassageService();
const userService = new UserService();
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
    const user = await userService.findByCard(req.params.card);
    res.status(200);
    const ret = {
      user: user,
      history: [],
    };
    message.object.forEach(o => ret.history.push(buildResponse(o)))
    res.send(ret)
  } catch (e){
    console.log(e)
    res.status(500);
    res.send();
  }
});
const buildResponse = (obj) => {
  return {sequential_id: obj.sequential_id, ip: obj.ip, time: new Date(obj.time).toLocaleString(), name: obj.lane_name, card: obj.card_id, user: obj.user_name}
}
const buildFailedResponse = (obj, card) => {
  return {ip: obj.ip, time: new Date().toLocaleString(), name: obj.name || "not found", card, user: obj.card_name}
}
router.post('/pass/master', async function(req, res, next) {
  const card = req.body.card;
  const lane = req.body.lane;
  const message = await passService.accessMaster(card, lane);
  if(message.isErr){
    res.status(message.httpCode);
    const obj = await laneService.findByAddress(lane);
    webSocket.masterPassFailed(buildFailedResponse(obj, card));
  } else {
    res.status(200);
    webSocket.masterPass(buildResponse(message.object));
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
    const obj = await laneService.findByAddress(lane);
    webSocket.masterPassFailed(buildFailedResponse(obj, card));
  } else {
    res.status(200)
    webSocket.slavePass(buildResponse(message.object))
  }
  res.send()
})

module.exports = router;

