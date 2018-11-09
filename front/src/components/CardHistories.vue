<template>
  <div>
    <transition-group
      name='history-list-each'
      :css='false'
      @before-enter='beforeEnter'
      @enter='enter'
      >
      <div
        v-for='(history, ind) in historyArray'
        :key='history.sequential_id'
        class='log-box each-history'
        :data-ind='ind'>
        <div class="split">
          <div class="each-value">
            <div class="column">連番:</div>
            <div class="value">{{history.sequential_id}}</div>
          </div>
          <div class="each-value">
            <div class="column">時間:</div>
            <div class="value">{{history.time.split(" ")[1]}}</div>
          </div>
        </div>
        <div class="split">
          <div class="each-value">
            <div class="column">ｹﾞｰﾄ名:</div>
            <div class="value">{{history.lane_name}}</div>
          </div>
          <div class="each-value">
            <div class="column">IP:</div>
            <div class="value">{{history.ip}}</div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
const perChunk = 10
export default {
  props:{
    histories: {
      default: []
    }
  },
  methods: {
    beforeEnter: function(el){
      el.style.cssText = "transform: translateX(-600px); opacity: 0;"
    },
    enter: function(el, done){
      setTimeout(function () {
        el.style.cssText = ""
      }, 50 * el.dataset.ind)
    },
  },
  computed: {
    historyArray: function(){
      console.log(this.histories.slice(0,30)) 
      return this.histories.slice(0,30)
    }
  }
}
</script>

<style>
div>span{
  display: flex;
  width: calc(75% - 1.5rem);
  margin-right: 1.5rem;
  margin-bottom: 1rem;
  flex-direction: column;
  height: calc(100% - 1rem);
  flex-wrap: wrap;
}
.history{
  display: flex;
}
.split{
  width: 50%;
}
.each-value{
  height: 50%;
  display: flex;
}
.each-history{
  display: flex;
  margin: 0.5rem 1.5rem;
  height: calc(10% - 1.1rem);
  width: 33.3333%;
  flex-grow: 1;
  transition-property: transform;
  transition-duration: 0.3s;
}
.column{
  width: 40%;
  font-weight: bolder;
  font-size: 1.3rem;
}
.value{
  width: 60%;
  font-size: 1.3rem;
}
</style>
