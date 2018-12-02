const initialize = require('./test_common.js')
const local = process.argv.some(a => a === '-l' || a === '--local')

if(local){
  console.log('execute test with local mode (set server id address as 127.0.0.1)')
}

Array.prototype.sample = function(){
  return this[Math.floor(Math.random() * this.length)]
}

const exec = require('child_process').exec
const io = require('socket.io-client');
const fs = require('fs')
const axiosBase = require('axios')
const serverIp = local ? '127.0.0.1' : '192.168.20.200'

const axios = axiosBase.create({
  baseURL: `http://${serverIp}:3000/api`
});

const date = new Date(Date.now() + 1000*60*60*9)
const out_log = `endurance_${date.getYear()}_${date.getMonth()+1}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_tester_log`
const out_server = `endurance_${date.getYear()}_${date.getMonth()+1}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_server_log`

const mainSingnage = io(`ws://${serverIp}:3000`);
const watchdog = io(`ws://${serverIp}:3000`);
const register1 = io(`ws://${serverIp}:3000`);
const register2 = io(`ws://${serverIp}:3000`);
const register3 = io(`ws://${serverIp}:3000`);
const cardReader = io(`ws://${serverIp}:3000`);

const testMinutes = 60 * 14
const logSpace = 20

const blankRead = 'blankCardRead'
const notBlankRead = 'notBlankRead'
const conAsc = 'conAsc'
const conLost = 'conLost'
const masterPass = 'masterPass'
const masterFail = 'masterFail'
const slavePass = 'slavePass'
const slaveFail = 'slaveFail'
const cardRead = 'cardRead'

const consoleColor = {}
consoleColor[blankRead] = '\033[1;36m'
consoleColor[notBlankRead] = '\033[0;36m'
consoleColor[conAsc] = '\033[0;34m'
consoleColor[conLost] = '\033[0;37m'
consoleColor[masterPass] = '\033[1;33m'
consoleColor[masterFail] = '\033[0;33m'
consoleColor[slavePass] = '\033[0;35m'
consoleColor[slaveFail] = '\033[1;35m'
consoleColor[cardRead] = '\033[0;32m'

const registerPer = 10
const passPer = 10 * 60 
const readPer = 30 * 60

const slaves = []
for(let i = 1; i < 11; i++){
  slaves.push(`192.168.20.${60 + i}`)
}

initialize(
  serverIp, out_server, runTest, finalize
)

function log(sign, event, string){
  const spacify = str => (str + ' '.repeat(logSpace)).slice(0, logSpace)
  const output = `${spacify(sign)}${spacify(event)} ${Date.now()} ${string}`
  console.log(consoleColor[event.replace(/Rec$/, '')] + output)
  fs.appendFile(`./test_result/${out_log}`, output +  '\n', err => {if(err){console.log(err)}})
}

async function runTest(func){
  //登録用カード読み込み => ユーザ登録 最初の一時間のみ15秒ごと。以降なし。240人登録することになる。
    //3人に一人は一回目の登録で誤った名前を登録し、すぐに正しい名前での訂正リクエストを送る
  //マスターゲート通過 => レーン通過 登録後10分毎に行う。
    //mod 10 == 5 回目の実行時ではおかしなマスター通過リクエストを送った後、正しい通過リクエストを送り直す。
    //mod 10 == 0 回目の実行時では正しいマスター通過リクエストを送った後、おかしなレーン通過リクエストを送る。その後正しいレーン通過リクエストを送る
  //カード読み込み => 各ユーザは30分毎にこれを行う
  await webSocketInitialize()
  let userCount = 0;
  const register = async (mycard, myname) => {
    const screen = (mycard % registerMachineNum) + 1
    log(`register${screen}`, blankRead, `read ${mycard} on screen ${screen}`)
    await axios.get(`/user/read/${screen}/${mycard}`)
    if(mycard % 3 === 2){
      const regsterParams = new URLSearchParams();
      regsterParams.append('card', mycard)
      regsterParams.append('name', myname + 'wrong')
      await axios.post('/user/register', regsterParams)
      const correctParams = new URLSearchParams();
      correctParams.append('card', mycard)
      correctParams.append('name', myname)
      await axios.post('/user/register', correctParams)
    } else {
      const regsterParams = new URLSearchParams();
      regsterParams.append('card', mycard)
      regsterParams.append('name', myname)
      await axios.post('/user/register', regsterParams)
    }
  }
  const pass = async (mycard) => {
    const prms = new URLSearchParams();
    prms.append('card', mycard)
    prms.append('lane', '192.168.20.60')
    log('masterPass', masterPass, `${mycard} passed master`)
    await axios.post('/gate/pass/master', prms)
    const slavePassParams = new URLSearchParams();
    slavePassParams.append('card', mycard)
    const slave = slaves.sample()
    log('slavePass', slavePass, `${mycard} passed slave ${slave}`)
    axios.post(`/gate/pass/slave/${slave}`)
  }
  const read = async (mycard) => {
    log('cardRead', cardRead, `card ${mycard} read`)
    axios.get(`/card/read/${mycard}`).catch(err => console.log(err.response))
  }
  const registerMachineNum = 3
  setInterval(async () => {
    userCount++
    const mycard = userCount
    await register(mycard, `user${mycard}`)
    pass(mycard)
    read(mycard)
    setInterval(async () => {
      pass(mycard)
    }, passPer * 1000)
    setInterval(async () => {
      read(mycard)
    }, readPer * 1000)
  }, registerPer * 1000)
  setTimeout(() => {
    func()
  }, testMinutes * 60 * 1000)
}
function finalize(){
  delete process.env.KEMOSALO_TEST
  mainSingnage.close()
  watchdog.close()
  register1.close()
  register2.close()
  register3.close()
  cardReader.close()
}

async function webSocketInitialize(){
  mainSingnage.emit('mainSignageInitialize')
  watchdog.emit('watchdogInitialize')
  register1.emit('registerInitialize', 1);
  register2.emit('registerInitialize', 2);
  register3.emit('registerInitialize', 3);
  cardReader.emit('cardReaderInitialize');

  const mainPass = (obj) => `main gate passage. card => ${obj.card}`
  const mainPassFail = (obj) =>  `main gate passage failed. card => ${obj.card}`
  const blankCardRead = (obj) => `blank card read. card => ${obj.card}`
  const notBlankCardRead = (obj) => `filled card read. card => ${obj.data.card_id}`

  mainSingnage.on('masterPass', (obj) => log('mainSignage', masterPass + 'Rec', mainPass(obj)))
  mainSingnage.on('masterPassFailed', (obj) => log('mainSignage', masterFail + 'Rec',  mainPassFail(obj)))

  watchdog.on('masterPass', (obj) => log('watchdog', masterPass + 'Rec', mainPass(obj)))
  watchdog.on('masterPassFailed', (obj) => log('watchdog', msterFail + 'Rec', mainPassFail(obj)))
  watchdog.on('slavePass', (obj) => log('watchdog', slavePass + 'Rec', `slave gate ${obj.ip} passage. card => ${obj.card}`))
  watchdog.on('slavePassFailed', (obj) => log('watchdog', slaveFail + 'Rec', `slave gate ${obj.ip} passage failed. card => ${obj.card}`))
  watchdog.on('connectionAscertained', (ip, time) => log('watchdog', conAsc, `connection from ${ip} ascertained`))
  watchdog.on('connectionLost', (ip) => log('watchdog', conLost, `connection from ${ip} lost`))

  register1.on('blankCardRead', (obj) => log('register1', blankRead + 'Rec', blankCardRead(obj)))
  register1.on('notBlankReadRec', (obj) => log('register1', notBlankRead + 'Rec', notBlankReadRec(obj)))
  register2.on('blankCardRead', (obj) => log('register2', blankRead + 'Rec', blankCardRead(obj)))
  register2.on('notBlankReadRec', (obj) => log('register2', notBlankRead + 'Rec', notBlankReadRec(obj)))
  register3.on('blankCardRead', (obj) => log('register3', blankRead + 'Rec', blankCardRead(obj)))
  register3.on('notBlankReadRec', (obj) => log('register3', notBlankRead + 'Rec', notBlankReadRec(obj)))

  cardReader.on('cardRead', (obj) => log('cardreader', cardRead, `some card read. card => ${obj.card}`))
}
