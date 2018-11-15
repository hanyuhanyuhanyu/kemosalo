<template>
  <div id='main'>
    <div v-for='user in users' :key='user.id'>
      <a :href='`/user/${user.card_id}`'>{{user}}</a>
    </div>
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
      users: []
    } 
  },
  methods: {
  },
  mounted: function () {
    try{
      axios.get('/user').then(res => this.users = res.data).catch(e => console.log(e))
    } catch(e) {
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
