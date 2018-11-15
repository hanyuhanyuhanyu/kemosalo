<template>
  <div>
    <a v-if='href' :href='href' class='text log-box'>
      {{str}}
    </a>
    <s v-else class='text'>
      {{this.str}}
    </s>
  </div>
</template>

<script>
export default {
  props: {
    str: {
      default: "",
    },
    href: {
      default: null,
    }
  },
  computed: {
  }
}
</script>

<style scoped>
.text{
  font-size: 2rem;
  color: #cb964d;
  transition: .15s;
  overflow: hidden;
  white-space: nowrap;
}
a:hover{
  color: rgb(106,62,0);
  background-color: #cb964d;
}
</style>
