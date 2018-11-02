<template>
  <div>
    <div v-for='log in logs' :key='log.id'>
      {{log}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    logs: {
      default: []
    },
  }
}
</script>

<style>
</style>




