<template>
  <div id="accessLog" class='accessLog'>
    <first :logs="first"></first>
    <recent :logs="recent"></recent>
    <old :logs="old"></old>
  </div>
</template>

<script>
const divide = 4

import MostRecentLog from './MostRecentLog.vue';
import RecentLog from './RecentLog.vue';
import OldLog from './OldLog.vue';

export default {
  props: {
    logs: {
      default: [],
    }
  },
  computed:{
    first: function(){
      if(!this.logs){
        return null;
      }
      console.log(this.logs)
      return this.logs[0];
    },
    recent: function(){
      if(!this.logs){
        return [];
      }
      const ret = []
      for(let i = 1; i < this.logs.length; i++){
        ret.push(this.logs[i]);
      }
      return ret;
    },
    old: function(){
      if(!this.logs){
        return [];
      }
      const ret = []
      for(let i = divide; i < this.logs.length; i++){
        ret.push(this.logs[i]);
      }
      return ret;
    }
  },
  components: {
    'first': MostRecentLog,
    'recent': RecentLog,
    'old': OldLog,
  }
}
</script>

<style>
  .lane{
    width: 240px;
  }
  .isError{
    background-color: #ffaaaa;
  }
  .row{
    display:flex;
    width: 100%;
  }
  .column{
    width: 50%;
  }
  .elem{
    width: 50%;
  }
</style>


