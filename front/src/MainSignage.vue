<template>
  <div id='wrap'>
    <div class='basic-info'>
      <span v-if='error'>
        error!
      </span>
      <div v-if='logs[0]' style='height:100%;'>
        <div class="user-name">
          {{userName}}<br><div style='font-size: 2rem;'>さん</div>
        </div>
      </div>
      <div v-else style='display: flex; place-content: center center; align-self: center; height: 100%;'>
        <div class="image-wrapper">
          <img src='/images/companion_cube.png' class='cube-tan'>
        </div>
      </div>
    </div>
    <div class='history-view log-box h-12'>
      <div class="title-wrapper">
        <div class="title log-box">
          {{logs[0] ? '通過履歴' : 'カード読み取りを待っています'}}
        </div>
      </div>
      <div v-if='logs[0]' class="log-box w-12 each-logs" style='height: 40%;'>
        <div class='title log-box' style='font-size: 1.5rem; width: 45%; padding-bottom: 0.5rem'>直近の通過ゲート</div>
        <div class="time-view"> {{logs[0].name}} </div>
        <div class='timer'>{{logs[0].time.split(" ")[1]}}</div>
      </div>
      <div  v-if='logs[0]' class='rests log-box w-10'>
        <div class='title log-box' style='font-size: 1.5rem; width: 45%; padding-bottom: 0.5rem'>それ以前…</div>
        <div
          v-for='(history, ind) in initLogs'
          :key='history.sequential_id'
          class='log-box each-history w-12'
          :data-ind='ind'>
          <div class="time-view" style='font-size: 2.5rem; vertical-align: middle;'> {{history.name}} </div>
          <div class='timer' style='font-size: 1.5rem;'>{{history.time.split(" ")[1]}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const selfip = process.env.KEMOSALO_SERVER_IP
const axiosBase = require('axios');
import LaneStatus from './assets/laneStatus.js';
import Log from './assets/Log.js';
const axios = axiosBase.create({
  baseURL: `http://${selfip}:3000/api`
});

const logMax = 10;
export default {
  name: 'App',
  data: () => {
    return {
      logs: [],
      userName: "",
      error: false,
    }
  },
  methods: {
  },
  mounted: async function () {
    try{
      this.socket = io(`ws://${selfip}:3000`);
      this.socket.emit('mainSignageInitialize')
      this.socket.on('masterPass', async (obj) => {
        const history = await axios.get('/gate/history/' + obj.card);
        this.error = false;
        this.logs = [];
        history.data.forEach(d => this.logs.push(d));
        this.userName = this.logs[0].user
        console.log(this.logs)
        console.log(this.logs[0])
        console.log(this.userName)
      })
      this.socket.on('masterPassFailed', (obj) => {
        this.error = true;
      })
    } catch(e) {
      console.log('booting failed')
      console.log(e)
    }
  },
  computed: {
    initLogs: function () {
      return this.logs.slice(1,5)
    }
  },
  components: {
  }
}
</script>

<style>
div{
  color: #fc7;
}
div>span{
  display: flex;
  width: calc(75% - 1.5rem);
  margin-right: 1.5rem;
  margin-bottom: 1rem;
  flex-direction: column;
  height: calc(100% - 1rem);
  flex-wrap: wrap;
}
#wrap{
  display: flex;
  height: 100%;
}
.basic-info{
  width: 25%;
  height: 100%;
}
.history-view{
  display: flex;
  width: calc(75% - 3rem);
  flex-direction: column;
  align-items: center;
}
.history{
  display: flex;
}
.split{
  width: 100%;
}
.each-value{
  height: 50%;
  display: flex;
  flex-direction: column;
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
}
.column{
  width: 40%;
  color: #fc7;
  font-weight: bolder;
  font-size: 1.3rem;
}
.value{
  width: 60%;
  color: #fc7;
  font-size: 1.3rem;
}
.heoad{
  height: 60%;
}
.rests{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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
  height:100%;
  animation: piston 3s infinite alternate linear
}
.cube-tan{
  width: 65%;
  animation: rotate 5s linear infinite;
  align-self: center;
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
  font-size: 4rem;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
