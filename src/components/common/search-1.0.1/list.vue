<template>
  <div class="mk-search-list" v-if="isShow">
    <div class="search-ctn"><slot/></div>
    <div class="search-mask" @click="hide"></div>
  </div>
</template>
<script>
  export default {
    name: 'mk-search-list',
    data () {
      return {
        isShow: false
      }
    },
    methods: {
      show () {
        this.isShow = true
        document.documentElement.style.overflow = 'hidden'
      },
      hide () {
        this.isShow = false
        document.documentElement.style.overflow = 'auto'
      }
    }
  }
</script>
<style lang="scss">
  .mk-search-list {
    position:fixed;
    z-index: 100;
    top: rem(113);
    bottom:0;
    left:0;
    right:0;
    .search-ctn {
      position:relative;
      z-index:2;
    }
    .search-mask {
      position:absolute;
      background: rgba(0,0,0, 0.3);
      top:0;
      bottom:0;
      left:0;
      right:0;
      z-index:1;
    }
  }
</style>
