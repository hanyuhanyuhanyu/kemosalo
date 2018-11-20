<template>
  <div id='main'>
    <div class='search-box'>
      ユーザ検索:<input class='search' v-model='searching' placeholder='ユーザの名前を入力してください'>
    </div>
    <div class='controller'>
      <div class='left-arrow log-box'>
        {{leftPrompt}}
      </div>
      <div class='wrap'>
        <link-box v-for='user in matchedUser'
          :key='user.id'
          :str='makeUserString(user)'
          :href='`/user/${user.card_id}`'
          class='link log-box'
          >
        </link-box>
      </div>
      <div class='right-arrow log-box'>
        {{rightPrompt}}
      </div>
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
const onePage = 10
const oneChunk = 20
export default {
  data: () => {
    return {
      users: [],
      searching: "",
      defaultIndex: 0, //検索条件を指定していない場合に用いるindex
      ephemeralIndex: 0, //検索条件を指定シている場合に用いるindex。検索ワードが変わるたびに0に初期化されるので、'ephemeral'
      watchingDefault: true,
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
        return this.users.slice(this.defaultIndex * onePage, this.defaultIndex * onePage + oneChunk)
      }
      return this.users.filter(user => {
        return this.kanaToHira(user.name).match(this.kanaToHira(this.searching).slice(this.ephemeralIndex * onePage, this.ephemeralIndex * onePage + oneChunk))
      })
    },
    leftPrompt: function(){
      let checker = this.ephemeralIndex
      if(this.watchingDefault){
        checker = this.defaultIndex
      }
      return checker < 1 ? '止' : '前'
    }
  },
  watch: {
    searching: function(val){
      this.watchingDefault = val === ''
      this.ephemeralIndex = 0;
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
  height: 100%;
  width: 100%;
}
.search{
  font-size: 1.8rem;
  width: 50%;
}
.search-box{
  padding: 0.3rem;
  font-size: 2rem;
  height: 8%;
  width: 100%
}
.wrap{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 92%;
  width: 86%;
}
.link{
  font-size: 2rem;
  margin: 0.5rem 1rem;
  height: calc(10% - 1.0rem);
  width: calc(50% - 2rem);
}
.controller{
  display: flex;
  height: 100%;
  width: 100%;
}
.left-arrow, .right-arrow{
  width: calc(7% - 0.5rem);
  height: calc(92% - 1rem);
}
.left-arrow{
  margin: 0.5rem 0 0.5rem 0.5rem;
}
.right-arrow{
  margin: 0.5rem 0.5rem 0.5rem 0;
}

</style>
