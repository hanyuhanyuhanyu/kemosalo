<template>
  <div id='wrap' style='overflow: hidden'>
    <div class='basic-info'>
      <span v-if='error'>
        error!
      </span>
      <div style='height:100%; position: relative;'>
        <div v-if='noLogs || logs[0]' class="user-name" :style='{fontSize: determineFontSize(userName) + "rem"}'>
          <span v-if='userName' class='user-name'>
            {{userName}}<br><div style='font-size: 2rem;'>さん</div>
          </span>
          <span v-else class='user-name' style='color: #ff0'>
            名前が登録<br>されていません！
          </span>
        </div>
        <div :class='{"image-wrapper-animation": !(noLogs || logs[0])}' class='image-wrapper'>
          <img src='/images/companion_cube.png' class='cube-tan'>
        </div>
      </div>
    </div>
    <div class='history-view log-box h-12'>
      <div class="title-wrapper">
        <div class="title log-box">
          {{noLogs || logs[0] ? '通過履歴' : 'カード読み取りを待っています'}}{{cursor}}
        </div>
      </div>
      <div class='no-logs' v-if='noLogs'>
        WELCOME!
      </div>
      <transition
        name='first-history'
        >
        <div v-if='logs[0]' class="log-box w-12 each-logs" style='height: 40%;'>
          <div class='title log-box' style='font-size: 2.5rem; width: 45%;'>直近</div>
          <div class="time-view"> {{logs[0].name}} </div>
          <div class='timer'>{{logs[0].time.split(" ")[1]}}</div>
        </div>
      </transition>
      <div class='w-10' :class='{"log-box": !!logs[0]}' style='display: flex; flex-direction: column;'>
        <div v-if='logs[0]' style="height: 20%; width; 100%;">
          <div class='title log-box' style='position: relative; height: 100%; font-size: 1.5rem; width: 45%; flex-grow: 1;'>それ以前…</div>
        </div>
        <transition-group
          name='history-list-each'
          :css='false'
          style='height: 80%; position: relative; display: flex; flex-direction: column; flex-shrink: 1;'
          tag='div'
          @before-enter='beforeEnter'
          @enter='enter'
          >
          <div
            v-for='(history, ind) in initLogs'
            :key='history.sequential_id'
            class='log-box each-history w-12'
            :data-ind='ind'
            >
            <div class="time-view" style='padding:0;font-size: 3.5rem; vertical-align: middle;'> {{history.name}} </div>
            <div class='timer' style='font-size: 1.5rem;'>{{history.time.split(" ")[1]}}</div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
const selfip = process.env.KEMOSALO_SERVER_IP
const axiosBase = require('axios');
import LaneStatus from './assets/laneStatus.js';
import Winker from './assets/winker.js';
import Log from './assets/Log.js';
const axios = axiosBase.create({
  baseURL: `http://${selfip}:3000/api`
});

const logMax = 10;
const displayRefersh = 60;
export default {
  name: 'App',
  data: () => {
    return {
      logs: [],
      userName: "",
      error: false,
      countDown: 1,
      cursorOn: true,
      noLogs: false,
    }
  },
  methods: {
    beforeEnter: function(el){
      el.style.cssText = `transform: translateX(600px); margin-left: calc(0.5rem + ${el.dataset.indind*0.5}rem)`
    },
    enter: function(el, done){
      setTimeout(function () {
        el.style.cssText = `margin-left: calc(0.5rem + ${el.dataset.ind*0.5}rem)`
      }, 50 * el.dataset.ind + 200)
    },
  },
  mounted: async function () {
    Winker(() => this.cursorOn = !this.cursorOn)
    try{
      this.socket = io(`ws://${selfip}:3000`);
      this.socket.emit('mainSignageInitialize')
      this.socket.on('masterPass', async (obj) => {
        this.noLogs = false
        const ret = await axios.get('/gate/history/' + obj.card);
        this.error = false;
        this.logs = [];
        ret.data.history.forEach(d => this.logs.push(d));
        const usr = ret.data.user
        this.userName = usr ? usr.name : null
        this.countDown = displayRefersh;
        if(this.logs.length < 1){
          this.noLogs = true
        }
      })
      this.socket.on('masterPassFailed', (obj) => {
        this.error = true;
      })
      setInterval(() => {
        this.countDown--
        if(this.countDown <= 0){
          this.countDown = 0;
          this.logs = []
          this.userName = ""
        }
      }, 1000)
    } catch(e) {
      console.log('booting failed')
      console.log(e)
    }
  },
  computed: {
    initLogs: function () {
      return this.logs.slice(1,5)
    },
    determineFontSize: function () {
      return name => {
        if(name === null){
          return 4.0;
        }
        let length = 0;
        for(let i = 0; i < name.length; i++){
          length += Math.min(encodeURIComponent(name[i]).replace(/%../g,"x").length, 2)
        }
        return 4.0 - Math.max(length-10, 0) * 0.3;
      }
    },
    cursor: function(){
      return this.cursorOn ? "_" : " "
    }
  },
  components: {
  }
}
</script>

<style scoped>
div{
  color: #fc7;
}
#wrap{
  display: flex;
  height: 100%;
}
.basic-info{
  width: 30%;
  height: 100%;
}
.history-view{
  display: flex;
  width: calc(70% - 1.5rem);
  margin-left: 0;
  flex-direction: column;
  align-items: center;
}
.each-logs div, .each-logs span{
  margin: 0;
}
.each-logs{
  position: relative;
  display: flex;
  flex-direction: column;
}
.time-view{
  font-size: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}
.timer{
  position: absolute;
  vertical-align: bottom;
  text-align: right;
  font-size: 2rem;
  bottom: 0;
  right: 0;
}
.each-history{
  position: relative;
  display: flex;
  margin: 0.5rem 1.5rem;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  transition-property: transform;
  transition-duration: 0.3s;
}
.title-wrapper{
  width: 100%;
}
.title{
  width: 80%;
  margin: 0;
  font-size: 2rem;
  border-top: none;
  border-left: none;
}
.image-wrapper{
  display: flex;
  place-content: center center;
}
.image-wrapper-animation{
  animation: piston 3s linear infinite alternate;
  height:100%;
}
.cube-tan{
  position: absolute;
  width: 65%;
  align-self: center;
  transition: all 0.3s;
  animation: rotate 5s linear infinite;
}
@keyframes piston{
  0%{transform: translateY(-120px);}
  100%{transform: translateY(120px);}
}
@keyframes rotate{
  0%{transform: rotate(0deg);}
  50%{transform: rotate(180deg);}
  100%{transform: rotate(360deg);}
}
.user-name{
  display: flex;
  height: 70%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.first-history-enter-active{
  transition: transform .2s;
}
.first-history-enter{
  transform: translateX(600px);
}
.no-logs{
  position: absolute;
  height: 70%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 6rem;
}
</style>
