<template>
  <div id="app">
    <div v-for='lane in laneObjs' :key='lane.ip'>
      {{lane.ip}} => {{lane.alive}}
    </div>
  </div>
</template>

<script>
const selfip = process.env.KEMOSALO_SERVER_IP
const axiosBase = require('axios');
import LaneStatus from './assets/laneStatus.js';

const axios = axiosBase.create({
  baseURL: `http://${selfip}:3000/api`
});
export default {
  name: 'App',
  data () {
    return {
      socket: null,
      hoge: 123,
      lanes: {},
    }
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
      this.socket.on('masterPass', () => {
        console.log('masterPass')
      })
      this.socket.on('masterPassFailed', () => {
        console.log('masterPassFailed')
      })
      this.socket.on('slavePass', (lane) => {
        console.log('slavePass', lane)
      })
      this.socket.on('slavePassFailed', (lane) => {
        console.log('slavePassFailed', lane)
      })
    } catch(e) {
      console.log('booting failed')
      console.log(e)
    }
  },
  computed: {
    laneObjs: function(){
      const ret = []
      Object.keys(this.lanes).forEach(k => ret.push(this.lanes[k]))
      return ret
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
