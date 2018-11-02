<template>
  <div id="app">
    <span v-if='error'>
      error!
    </span>
    <span v-else v-for="l in logs" :key='l.sequential_id'>
      {{l}}
    </span>
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
      error: false,
    }
  },
  methods: {
  },
  mounted: async function () {
    try{
      this.socket = io(`ws://${selfip}:3000`);
      this.socket.on('masterPass', async (obj) => {
        const history = await axios.get('/gate/history/' + obj.card);
        this.error = false;
        this.logs = [];
        history.data.forEach(d => this.logs.push(d));
        console.log(history.data);
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
  },
  components: {
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
.laneWrapper{
  display: flex;
  justify-items: center;
  align-items: center;
}
</style>
