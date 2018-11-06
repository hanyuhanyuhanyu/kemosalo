<template>
  <div class='wrapper'>
    <div class="basic-info">
      <most-recent-log
        :log='firstLog'
        class='most-recent w-8 h-12 padding'
      >
      </most-recent-log>
      <div id="accessed-num" class='padding log-box w-4 h-12'>
        通過総計:{{firstLog && firstLog.id}}
      </div>
    </div>
    <div class="others">
      <access-log
        :logs='logs'
        class='access-log w-4'
      ></access-log>
      <div class="informations">
        <operations 
          class='operations log-box w-12 h-2'
        ></operations>
        <watcher
          :master='masterLane'
          :lanes='slaveLanes'
          class='watcher log-box w-12 h-8'
        ></watcher>
        <foot
          class='footer log-box w-12 h-2'
        ></foot>
      </div>
    </div>
    <div class='laneWrapper' v-for='chunk in laneChunks()' :key='chunk.key'>
      <single-lane
        v-for='lane in chunk.arr'
        :key='lane.id'
        :lane='lane'
      ></single-lane>
    </div>
  </div>
</template>

<script>
const selfip = process.env.KEMOSALO_SERVER_IP
const axiosBase = require('axios');
import LaneStatus from './assets/laneStatus.js';
import Log from './assets/Log.js';

import AccessLog from './components/AccessLog.vue';
import MostRecentLog from './components/MostRecentLog.vue';
import SingleLane from './components/Lane.vue';
import Operations from './components/Operations.vue';
import Watcher from './components/Watcher.vue';
import Footer from './components/Footer.vue';


const axios = axiosBase.create({
  baseURL: `http://${selfip}:3000/api`
});

const logMax = 10;
export default {
  name: 'App',
  data: () => {
    return {
      socket: null,
      lanes: {},
      logs: [],
      errorLogs: [],
      logNum: 0,
    }
  },
  methods: {
    addLog: function(obj){
      console.log(this.logs.length)
      console.log(logMax)
      if(this.logs.length >= logMax){
        this.logs.pop();
      }
      this.logs.unshift(new Log(obj));
    },
    addErrorLogs: function(obj){
      if(this.errorLogs.length >= logMax){
        this.errorLogs.pops();
      }
      this.errorLogs.unshift(new Log(obj))
      console.log(this.errorLogs)
    },
  },
  mounted: async function () {
    try{
      const ips = await axios.get('/gate/all')
      ips.data.forEach(l => {
        this.$set(this.lanes, l.ip, new LaneStatus(l.ip, l.name, l.kind))
      })
      this.socket = io(`ws://${selfip}:3000`);
      this.socket.emit('initialize');
      this.socket.on('connectionAscertained', (ip, time) => {
        this.lanes[ip].access(time)
      })
      this.socket.on('connectionLost', ip => {
        this.lanes[ip].disconnect()
      })
      this.socket.on('masterPass', (obj) => {
        console.log('masterPass')
        this.addLog(obj);
      })
      this.socket.on('masterPassFailed', (obj) => {
        console.log('masterPassFailed')
        this.addErrorLogs(obj);
      })
      this.socket.on('slavePass', (obj) => {
        console.log('slavePass', lane)
        this.addLog(obj);
      })
      this.socket.on('slavePassFailed', (obj) => {
        console.log('slavePassFailed', lane)
        this.addErrorLogs(obj);
      })
    } catch(e) {
      console.log('booting failed')
      console.log(e)
    }
  },
  computed: {
    laneChunks: function(){
      return (chunk = 5) => {
        const ret = []
        let buf = []
        let i = 0
        Object.keys(this.lanes).forEach(k => {
          buf.push(this.lanes[k]);
          i++;
          if(i % chunk === 0){
            ret.push({key: i, arr: buf});
            buf = [];
          }
        })
        if(buf.length > 0){
          ret.push({key: i, arr: buf});
        }
        return ret
      }
    },
    firstLog: function(){
      console.log(this.logs[0])
      return this.logs[0];
    },
    masterLane: function() {
      return Object.values(this.lanes).filter(l => l.kind === 'master')[0]
    },
    slaveLanes: function() {
      return Object.values(this.lanes).filter(l => l.kind !== 'master')
    }
  },
  components: {
    'single-lane': SingleLane,
    'access-log': AccessLog,
    'most-recent-log': MostRecentLog,
    'operations': Operations,
    'watcher': Watcher,
    'foot': Footer,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.basic-info{
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 10%;
}
.others{
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 90%;
}
.laneWrapper{
  display: flex;
  justify-items: center;
  align-items: center;
}
#accessed-num{
  width: 25%;
  align-items: center;
  font-size: 1.5rem;
}
.most-recent{
  font-size: 2rem;
}
.wrapper{
  height: 100%;
  margin: 0;
  padding: 0;
}
.informations{
  width: 66.6666%;
  height: 100%;
}
.operations{

}
.watcher{

}
.footer{

}
</style>
