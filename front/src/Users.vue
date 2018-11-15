<template>
  <div id='main'>
    <div class='search-box'>
      ユーザ検索:<input class='search' v-model='searching' placeholder='ユーザの名前を入力してください'>
    </div>
    <div v-for='user in matchedUser' :key='user.id'>
      <link-box
        :str='makeUserString(user)'
        :href='`/user/${user.card_id}`'
        >
      </link-box>
    </div>
  </div>
</template>

<script>
const selfip = process.env.KEMOSALO_SERVER_IP
const axiosBase = require('axios');
const axios = axiosBase.create({
  baseURL: `http://${selfip}:3000/api`
});
import LinkBox from './components/LinkBox.vue';
export default {
  data: () => {
    return {
      users: [],
      searching: "",
    } 
  },
  methods: {
    makeUserString: function(user){
      return `${user.name}さん(cardno:${user.card_id})`
    },
    kanaToHira: function(str){
      return str.replace(/[\u30a1-\u30f6]/g, function(match) {
          var chr = match.charCodeAt(0) - 0x60;
          return String.fromCharCode(chr);
      });
    }
  },
  mounted: function () {
    try{
      axios.get('/user').then(res => this.users = res.data).catch(e => console.log(e))
    } catch(e) {
      console.log(e)
    }
  },
  computed: {
    matchedUser: function(){
      if(this.searching === ""){
        return this.users
      }
      return this.users.filter(user => {
        return this.kanaToHira(user.name).match(this.kanaToHira(this.searching))
      })
    }
  },
  components: {
    'link-box': LinkBox,
  }
}
</script>

<style scoped>
#main{
  z-index: 5;
}
.search{
  font-size: 1.8rem;
  width: 50%;
}
::-webkit-input-placeholder{
  color: #000;
}
.search-box{
  padding: 0.3rem;
  font-size: 2rem;
  height: 8%;
  width: 100%
}
</style>
