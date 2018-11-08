<template>
  <div id='main' class='log-box'>
    {{logOut}}{{cursor}}
  </div>
</template>

<script>
export default {
  props: {
    log: {
      default: ""
    },
    cursorOn: {
      default: false
    }
  },
  data: () => {
    return {
      buffer: "",
      exceeded: [],
      logOut: "",
      outing: false,
    }
  },
  mounted: function () {
    setInterval(() => {
      if(this.buffer.length > 0){
        if(!this.outing){
          this.logOut = '';
        }
        this.outing = true
        this.logOut += this.buffer[0]
        this.buffer = this.buffer.slice(1)
      } else {
        this.outing = false;
      }
    }, 15)
    this.buffer = this.log
  },
  computed:{
    cursor: function(){
      return this.cursorOn ? "_" : " ";
    }
  },
  watch: {
    log: function (val){
      this.logOut = "";
      this.buffer = val
    }
  }
}
</script>
