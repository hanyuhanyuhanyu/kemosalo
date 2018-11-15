<template>
  <div class='accessLog'>
    <transition-group name='logs' id='trans' tag='span' style='height: 100%;'>
      <div class='each-log log-box' v-for='log in logs' :key='log.id'>
        <div class="data-box">
          <div class="columns">
            <div class="column">Card</div>
            <div class="column">Time</div>
          </div>
          <div class="rows">
            <div class="row">{{log.card}}</div>
            <div class="row">{{log.time.split(' ')[1]}}</div>
          </div>
        </div>
        <div class="data-box">
          <div class="columns">
            <div class="column">Gate</div>
            <div class="column">IP</div>
          </div>
          <div class="rows">
            <div class="row">{{log.name}}</div>
            <div class="row">{{log.ip}}</div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>

export default {
  props: {
    logs: {
      default: [],
    }
  },
  components: {
  }
}
</script>

<style scoped>
.accessLog{
  display: flex;
  flex-direction: column;
}
.each-log{
  font-size: 1.5rem;
  height: calc(10% - 1.1rem);
  box-sizing: border-box;
  transition: all 0.3s;
  flex-grow: 1;
  flex-shrink: 1;
}
.logs-enter{
  transform: translateX(-100%);
}
.logs-leave-to{
  opacity: 0;
}
.data-box{
  display: flex;
  width: 50%;
}
.columns {
  width: 30%;
}
</style>


