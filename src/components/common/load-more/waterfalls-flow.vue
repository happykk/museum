<template>
  <div class="mk-waterfalls-flow">
    <div v-for="it in list">
      <div v-for="(item, index) in it" :ref="'item' + index"><slot :item="item" :index="index"/></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'mk-waterfalls-flow',
    computed: {
      column () {
        return this.$attrs.column || 2
      }
    },
    data () {
      return {
        list: []
      }
    },
    watch: {
      '$attrs.data' () {
        this.getData()
      }
    },
    methods: {
      getData () {
        let data = this.$attrs.data
        for (let i = 0; i < this.column; i++) {
          this.$set(this.list, i, [])
        }
        data.forEach((item, index) => {
          this.list[index % this.column].push(item)
        })
      }
    },
    created () {
      this.getData()
    }
  }
</script>
<style lang="scss" scoped>
  .mk-waterfalls-flow {
    @include display-box();
    > div {
      @include box-flex(1);
    }
  }
</style>
