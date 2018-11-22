<template>
  <div id='main'>
    <div id="user">
      <span style='font-size: larger;'>{{user.name}}</span>さんの履歴です
    </div>
    <div class='controller'>
      <div class="arrow-overlay">
        <arrow
          class='arrow-wrapper log-box'
          style='margin: 0.5rem 0 0.5rem 0.5rem;'
          :prompt='leftPrompt'
          :stopping='leftPrompt==="止"'
          @func='prev'
        >
        </arrow>
      </div>
      <transition-group
        v-if='history.length > 0'
        class='wrap'
        name='users'
        tag='div'
        :css='false'
        @before-enter='beforeEnter'
        @enter='enter'
        >
        {{history}}
        <link-box
          v-for='his in history'
          :key='his.sequential_id'
          :str='makeString(his)'
          class='link log-box'
          >
        </link-box>
      </transition-group>
      <div class='wrap' style='justify-content: center; align-items: center; font-size: 2rem' v-else>
        {{user.name}}さんはまだ一度も<br>クロークを利用していないようです
      </div>
      <div class="arrow-overlay">
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
const oneChunk = 20
export default {
  data: () => {
    return {
      user: {},
      historyOrigin: [],
      index: 0,
      lastPushedIsRight: true,
    } 
  },
  methods: {
    beforeEnter: function(el){
      const offset = this.lastPushedIsRight ? '1960px' : '-1960px'
      el.style.cssText = `transform: translateX(${offset});`
    },
    enter: function(el){
      setTimeout(()=>el.style.cssText = 'transform: translateX(0);', 1);
    },
    makeString: function(his){
      const time = his.time.split(' ')[1]
      const lane = his.lane_name
      return `${lane} => ${time}`;
    },
    prev: function(){
      if(this.leftPrompt === '止'){
        return
      }
      this.lastPushedIsRight = false
      this.index--
    },
    next: function(){
      if(this.rightPrompt === '止'){
        return
      }
      this.lastPushedIsRight = true
      this.index++
    },
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
    history: function(){
      let index = this.index
      return this.historyOrigin.slice(index * oneChunk, index * oneChunk + oneChunk)
    },
    leftPrompt: function(){
      let checker = this.index
      return checker < 1 ? '止' : '前'
    },
    rightPrompt: function(){
      let checker = this.index
      return this.historyOrigin.length > checker * oneChunk + oneChunk ? "次" : "止"
    }
  },
  mounted: function () {
    try{
      axios.get(`/user/${this.$route.params.id}`).then(res => {
        this.user = res.data.user
        this.historyOrigin = res.data.history
      }).catch(e => console.log(e))
    } catch(e) {
      console.log(e)
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
}
#user{
  font-size: 2.5rem;
  padding: 0.3rem;
  height: 8%;
  display: flex;
  align-items: center;
}
.controller{
  display: flex;
  flex-wrap: nowrap;
  height: 92%;
  width: 100%;
}
.wrap{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
  overflow: hidden;
  width: 86%;
}
.arrow-wrapper{
  width: 100%;
  height: calc(95% - 1rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.link{
  font-size: 2rem;
  margin: 0.5rem 1rem;
  height: calc(10% - 1.0rem);
  width: calc(50% - 2rem);
  transition: transform 0.3s;
  padding-left: 0.5rem;
}
.arrow-overlay{
  display: flex;
  height:100%;
  width: 7%;
  align-items: center;
}
</style>
