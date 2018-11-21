<template>
  <div id='main'>
    <div class='search-box'>
      ユーザ検索:<input class='search' v-model='searching' placeholder='ユーザの名前を入力してください'>
    </div>
    <div class='controller'>
      <div 
        class='arrow-wrapper log-box'
        :class='{"hoverable" : leftPrompt!=="止"}'
        style='margin: 0.5rem 0 0.5rem 0.5rem;'
        @click='prev'
        >
        <div class="arrow-wrapper-inner">
          <div class="arrow-kanji">
            {{leftPrompt}}
          </div>
          <div class="arrow-itself">
            <div class="arrow-upper" :class='{"upper-on": leftPrompt!=="止"}'></div>
            <div class="arrow-downer" :class='{"downer-on": leftPrompt!=="止"}'></div>
          </div>
        </div>
      </div>
      <!-- <transition&#45;group -->
      <!--   class='wrap' -->
      <!--   name='users' -->
      <!--   tag='div' -->
      <!--   > -->
      <div class="wrap">
        <link-box v-for='user in matchedUserSliced'
          :key='user.id'
          :str='makeUserString(user)'
          :href='`/user/${user.card_id}`'
          class='link log-box'
          >
        </link-box>
      <!-- </transition&#45;group> -->
      </div>
      <div
        class='arrow-wrapper log-box'
        :class='{"hoverable" : rightPrompt!=="止"}'
        style='margin: 0.5rem 0.5rem 0.5rem 0;'
        @click='next'
        >
        <div class="arrow-wrapper">
          <div class="arrow-kanji">
            {{rightPrompt}}
          </div>
          <div class="arrow-itself" style='transform: rotate(180deg);'>
            <div class="arrow-upper" :class='{"upper-on": rightPrompt!=="止"}'></div>
            <div class="arrow-downer" :class='{"downer-on": rightPrompt!=="止"}'></div>
          </div>
        </div>
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
      lastPushedIsRight: true,
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
  /* transition: all 0.3s; */
}
.controller{
  display: flex;
  height: 100%;
  width: 100%;
}
.arrow-wrapper{
  width: calc(7% - 0.5rem);
  height: calc(92% - 1rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.arrow-wrapper-inner{
  display: flex;
  margin-top: -2rem;
  flex-direction: column;
  align-items: center;
}
/* .arrow-wrapper, .arrow-kanji, .arrow-itself, .arrow-upper, .arrow-downer, .arrow-wrapper-inner{ */
/*   transition: all 0.2s  */
/* } */
.hoverable:hover, .hoverable:hover>*{
  background-color: #cb964d;
  color: rgb(106,62,0);
  cursor: pointer;
}
.hoverable:hover .arrow-upper, .hoverable:hover .arrow-downer{
  border-left: 2px solid rgb(106,62,0);
  border-right: 2px solid rgb(106,62,0);
}
.arrow-kanji{
  display: flex;
  font-size: 2rem;
}
.arrow-itself{
  height: 40px;
  display: flex;
  flex-direction: column;
}
.arrow-upper, .arrow-downer{
  width: 0;
  height: 100%;
  border-left: 2px solid #cb964d;
  border-right: 2px solid #cb964d;
  margin-bottom: 0;
  transition: all  0.2s;
}
.upper-on{
  transform: rotate(45deg);
  margin-bottom: -5.0px;
}
.downer-on{
  transform: rotate(-45deg);
  margin-top: -5.0px;
}
</style>
