<template>
  <div id="accessLog" class='accessLog'>
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

<style>
#accessLog{
  width: 30%;
}
.each-log{
  font-size: 1.5rem;
}
.data-box{
  display: flex;
  width: 50%;
}
.columns {
  width: 30%;
}
</style>


