<template>
  <div id='main'>
    {{prompt}}
    {{card}}
    <span v-if="card">
      名前<input :value='name' type="text">
      <button @click="register">
        登録
      </button>
    </span>
  </div>
</template>

<script>
const selfip = process.env.KEMOSALO_SERVER_IP
const axiosBase = require('axios');
const axios = axiosBase.create({
  baseURL: `http://${selfip}:3000/api`
});
export default {
  data: () => {
    return {
      name: '',
      card: null,
      prompt: 'カードを読み取ってください',
    }
  },
  methods: {
    register: function(){
      console.log(this.$route.params.id)
      let params = new URLSearchParams();
      params.append('card', this.card)
      params.append('name', this.name)
      axios.post('/user/register', params).then(res => 0).catch(error => 0)
    }
  },
  mounted: function () {
    try{
      this.socket = io(`ws://${selfip}:3000`);
      this.socket.emit('registerInitialize', this.$route.params.id);
      this.socket.on('blankCardRead', obj => {
        this.card = obj.card
        this.prompt = '読取成功'
      })
    } catch(e) {
      console.log('booting failed')
      console.log(e)
    }
  },
}
</script>

<style scoped>
#main{
  z-index: 5;
}
</style>
