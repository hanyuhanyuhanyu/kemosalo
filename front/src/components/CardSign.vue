<template>
  <div class=''>
    {{cardOut}}{{cursor}}
  </div>
</template>

<script>
export default {
  props:{
    card: {
      default: undefined
    },
    cursorOn: {
      default: false
    }
  },
  data: () => {
    return {
      cardOut: "",
      buffer: "カードを読み込んでください",
      outing: false,
    }
  },
  mounted: function () {
    setInterval(() => {
      if(this.buffer.length > 0){
        if(!this.outing){
          this.cardOut = '';
        }
        this.outing = true
        this.cardOut += this.buffer[0]
        this.buffer = this.buffer.slice(1)
      } else {
        this.outing = false;
      }
    }, 15)
  },
  computed:{
    cardName: function(){
      return this.card ? `読取成功: ${this.card}の履歴は以下の通りです` : "カードを読み込んでください"
    },
    cursor: function(){
      return this.cursorOn ? "_" : " ";
    }
  },
  watch: {
    card: function (val){
      this.cardOut = "";
      this.buffer = `読取成功: ${val}の履歴は以下の通りです` 
    }
  } 
}
</script>

<style scoped>
</style>
