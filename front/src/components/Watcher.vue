<template>
  <div id='main'>
    <div id="master" class='log-box h-4 w-12'>
      <div class="over log-box">master</div>
      <div class="image">
      </div>
      <div class="infos">
        <div v-for='info in masterInfos' :key='info.key' class='info'>
          {{info.key}} => {{info.value}}
        </div>
      </div>
    </div>
    <div id="slaves" class='log-box h-8 w-12'>
      {{master}}
    </div>
  </div>
</template>

<script>
const infos = ['alive', 'ip', 'name', 'time']
const jpInfos = {
  alive: '死活',
  name: 'ゲート名',
  ip: 'IP',
  time: 'レスポンス',
}

export default {
  props:{
    master:{
      default: null
    },
    lanes: {
      default: []
    }
  },
  computed: {
    masterInfos: function () {
      const ret = []
      infos.forEach(i => {
        let obj = {}
        obj.key = jpInfos[i]
        obj.value = this.master[i]
        ret.push(obj)
      })
      return ret;
    }
  }
}
</script>

<style>
#master{
}
#slaves{
}
#main{
  display: flex;
  flex-direction: column;
}
.over{
  margin: 0.5rem 0.7rem;
  padding: 0 1rem;
  position: absolute;
  font-size: 1.5rem;
  z-index: 1;
}
.image{
  height: 100%;
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
}
.infos{
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  height: 100%;
  width: 80%;
  margin: 0;
  padding: 0;
}
.info{
  width: 40%;
  height: 20%;
}
</style>
