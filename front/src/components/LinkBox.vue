<template>
  <div>
    <a v-if='href' :href='href' class='text' :style='given'>
      {{str}}
    </a>
    <span v-else class='text'>
      {{str}}
    </span>
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
    },
    given: {
      default: '',
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
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}
a:hover{
  color: rgb(106,62,0);
  background-color: #cb964d;
}
</style>
