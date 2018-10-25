const express = require('express');
const router = express.Router();
const PassageService = require('../lib/service/PassageService.js')

const passService = new PassageService()


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
    res.status(message.httpCode)
  } else {
    res.status(200)
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
  } else {
    res.status(200)
  }
  // ここで監視画面に通知がほしい => 多分websocket
  res.send()
})

module.exports = router;

