<template>
  <div class="mod-index">
    {{title}}
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'Hello world',
      show: true
    }
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
.mod-index {
  color:red;
  font-size: 20px;
  .mod-hd {
    font-size:22px;
  }
}
</style>
