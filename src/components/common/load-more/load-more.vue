<template>
  <div class="mk-lm-last">
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">{{ noMoreText || '没有更多了' }}</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      noMore: false,
      noMoreText: '没有更多了'
    }
  },
  methods: {
    setOpt (obj) {
      Object.assign(this.$data, obj)
    }
  }
}
</script>
<style lang="scss" scoped>
  .mk-lm-last {
    color: #5e6d82;
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    text-align: center;
  }
</style>
