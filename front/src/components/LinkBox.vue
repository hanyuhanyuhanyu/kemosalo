<template>
  <div>
    <a v-if='href' :href='href' class='text'>
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
