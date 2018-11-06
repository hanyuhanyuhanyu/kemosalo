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
      <div v-for='lane in lanes' :key='lane.id' class="log-box each-lane">
        <div class="slave-image">
        </div>
        <div class="slave-infos">
          <div class='slave-info'>
            死活:{{lane.alive}}
          </div>
          <div class='slave-info'>
            名前:{{lane.name}}
          </div>
          <div class='slave-info'>
            IP:{{lane.ip}}
          </div>
          <div class='slave-info'>
            時間:{{lane.time}}
          </div>
        </div>
      </div>
      <div class="over log-box slave-title">slave</div>
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
      if(!this.master){
        return [] 
      }
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
#slaves{
  display: flex;
  flex-wrap: wrap;
}
.each-lane{
  margin: 0.5rem 0 0 0.5rem;
  padding: 0;
  width: calc(20% - 0.6rem);
  height: calc(50% - 0.75rem);
}
.slave-title{
  margin-top: 0;
  margin-left: 0;
}
.slave-image{
  width: 35%;
}
.slave-infos{
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}
.slave-info{
  margin: 0;
  height: 25%;
  display: flex;
  align-items: center;
  text-align: left;
}
</style>
