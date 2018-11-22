<template>
  <div
    :class='{"hoverable": !stopping}'
    @click='operation'
    >
    <div class="arrow-wrapper-inner">
      <div class="arrow-kanji">
        {{prompt}}
      </div>
    <div class="arrow-itself" :style='{"transform": righty ? "rotate(180deg)" : ""}'>
        <div class="arrow-upper" :class='{"upper-on": !stopping}'></div>
        <div class="arrow-downer" :class='{"downer-on": !stopping}'></div>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  props:{
    prompt: {
      default: "",
    },
    stopping: {
      default: false
    },
    righty: {
      default: false
    }
  },
  methods:{
    operation: function(){
      console.log(this.func)
      this.$emit("func")
    }
  }
}
</script>
<style scoped>
.arrow-wrapper-inner{
  display: flex;
  margin-top: -2rem;
  flex-direction: column;
  align-items: center;
}
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
