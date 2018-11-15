<template>
  <div id='main'>
    {{user}}
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
      user: null
    } 
  },
  methods: {
  },
  mounted: function () {
    try{
      axios.get(`/user/${this.$route.params.id}`).then(res => this.user = res.data).catch(e => console.log(e))
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
