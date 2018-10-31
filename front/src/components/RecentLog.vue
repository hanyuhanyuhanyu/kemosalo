<template>
  <div>
    <div v-for='log in logs'>
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




