<template>
  <div id='wrapper'>
    <card-sign
      :card='card'
      :cursorOn='cursorOn'
      class='log-box w-12 card-name'
    >
    </card-sign>
    <histories
      :histories='histories'
      class='history w-12'
    ></histories>
  </div>
</template>

<script>
import CardSign from './components/CardSign.vue';
import CardHistories from './components/CardHistories.vue';
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
      histories: [],
      card: false,
      cursorOn: false,
    }
  },
  methods: {
  },
  mounted: async function () {
    setInterval(() => {
      this.cursorOn = !this.cursorOn
    }, 600)
    try{
      this.socket = io(`ws://${selfip}:3000`);
      this.socket.emit('cardReaderInitialize')
      this.socket.on('cardRead', (obj) => {
        console.log(obj)
        this.card = obj.card
        this.histories = obj.histories
      })
      this.socket.on('cardReadFail', (err) => {
        console.log(err)
      })
    } catch(e) {
      console.log('booting failed')
      console.log(e)
    }
  },
  computed: {
  },
  components: {
    'card-sign': CardSign,
    'histories': CardHistories,
  }
}
</script>

<style scoped>
#wrapper{
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}
.card-name{
  height: calc(10% - 2rem);
  font-size: 2rem;
  display: flex;
  align-items: center;
}
.history{
  display: flex;
  height: 90%;
  align-items: stretch;
}
</style>
