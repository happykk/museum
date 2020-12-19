<template>
  <div class="mk-lm-arrow">
    <!-- <i :class="['icon', 'iconfontcom', 'circle']" :style="{display: isLoading ? 'block' : 'none'}">&#xe60d;</i> -->
    <i :class="['icon', 'iconfontcom', isRotate ? 'rotate' : '']"  :style="{display: !isLoading ? 'block' : 'none'}">&#xe655;</i>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        isLoading: false,
        isRotate: false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mk-lm-arrow {
    position: absolute;
    top: -55px;
    left: 50%;
    margin-left: -4px;
    font-size:30px;
    i {
      display:block;
      transition:.3s ease-in-out;
      -webkit-transition:.3s ease-in-out;
    }
    .rotate {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
    }
    .circle {
      animation: rotating 2s linear infinite;
      -webkit-animation: rotating 2s linear infinite;
    }
    @keyframes rotating {
      from{transform:rotate(0)}
      to{transform:rotate(360deg)}
    }
  }
</style>
