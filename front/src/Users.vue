<template>
  <div id='main'>
    <div class='search-box'>
      ユーザ検索:<input class='search' v-model='searching' placeholder='ユーザの名前を入力してください'>
    </div>
    <div class='controller'>
      <arrow
        class='arrow-wrapper log-box'
        style='margin: 0.5rem 0 0.5rem 0.5rem;'
        :prompt='leftPrompt'
        :stopping='leftPrompt==="止"'
        @func='prev'
      >
      </arrow>
      <transition-group
        class='wrap'
        name='users'
        tag='div'
        :css='false'
        @before-enter='beforeEnter'
        @enter='enter'
        >
        <link-box v-for='user in matchedUserSliced'
          :key='user.id'
          :str='makeUserString(user)'
          :href='`/user/${user.card_id}`'
          class='link log-box'
          >
        </link-box>
      </transition-group>
      <arrow
        class='arrow-wrapper log-box'
        style='margin: 0.5rem 0.5rem 0.5rem 0;'
        :prompt='rightPrompt'
        :stopping='rightPrompt==="止"'
        :righty='true'
        @func='next'
      >
      </arrow>
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
import Arrow from './components/Arrow.vue';
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
      lastPushedIsRight: true,
    } 
  },
  methods: {
    beforeEnter: function(el){
      const offset = this.lastPushedIsRight ? '1000px' : '-1000px'
      el.style.cssText = `transform: translateX(${offset});`
    },
    enter: function(el){
      setTimeout(()=>el.style.cssText = 'transform: translateX(0);', 1);
    },
    makeUserString: function(user){
      return `${user.name}さん(cardno:${user.card_id})`
    },
    kanaToHira: function(str){
      return str.replace(/[\u30a1-\u30f6]/g, function(match) {
          var chr = match.charCodeAt(0) - 0x60;
          return String.fromCharCode(chr);
      });
    },
    prev: function(){
      if(this.leftPrompt === '止'){
        return
      }
      this.lastPushedIsRight = false
      this.watchingDefault ? this.defaultIndex-- : this.ephemeral--
    },
    next: function(){
      if(this.rightPrompt === '止'){
        return
      }
      this.lastPushedIsRight = true
      this.watchingDefault ? this.defaultIndex++ : this.ephemeral++
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
    matchedUserRaw: function(){
      if(this.searching === ""){
        return this.users
      }
      return this.users.filter(user => {
        return this.kanaToHira(user.name).match(this.kanaToHira(this.searching))
      })
    },
    matchedUserSliced: function(){
      let index = this.defaultIndex
      if(this.searching !== ""){
        index = this.ephemeralIndex
      }
      return this.matchedUserRaw.slice(index * oneChunk, index * oneChunk + oneChunk)
    },
    leftPrompt: function(){
      let checker = this.ephemeralIndex
      if(this.watchingDefault){
        checker = this.defaultIndex
      }
      return checker < 1 ? '止' : '前'
    },
    rightPrompt: function(){
      let checker = this.ephemeralIndex
      if(this.watchingDefault){
        checker = this.defaultIndex
      }
      return this.matchedUserRaw.length > checker * oneChunk + oneChunk ? "次" : "止"
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
    'arrow': Arrow,
  }
}
</script>

<style scoped>
#main{
  z-index: 5;
  height: 100%;
  width: 100%;
  display:flex;
  flex-direction:column;
  flex-wrap: no-wrap;
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
  height: 100%;
  overflow: hidden;
  width: 86%;
}
.link{
  font-size: 2rem;
  margin: 0.5rem 1rem;
  height: calc(10% - 1.0rem);
  width: calc(50% - 2rem);
  transition: transform 0.3s;
}
.controller{
  display: flex;
  flex-wrap: nowrap;
  height: 92%;
  width: 100%;
}
.arrow-wrapper{
  width: calc(7% - 0.5rem);
  height: calc(100% - 1rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
