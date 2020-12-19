<template>
  <a :class="['mk-nav-item', $attrs.selected !== undefined ? $parent.selectedClass : '']" ref="item" :style="'color:' + $parent.$attrs['color']" @click="onSelected">
    <i :class="['icon', $attrs['icon-class']]">
      <span class="box-1"><img :src="$attrs.img" v-if="$attrs.img !== undefined"/><em v-html="$attrs.icon"></em></span>
      <span class="box-2" :style="'color:' + $parent.$attrs['selected-color']"><img :src="$attrs['selected-img']" v-if="$attrs.img !== undefined"/><em v-html="$attrs['selected-icon'] ? $attrs['selected-icon'] : $attrs.icon"></em></span>
      <span class="mod-dot" v-if="$attrs.dot !== undefined && $attrs.dot !== false">&nbsp;</span>
      <span class="mod-buy-num" v-if="num !== undefined">{{ num }}</span>
    </i>
    <p class="box-1">{{ $attrs.text }}</p>
    <p class="box-2" :style="'color:' + $parent.$attrs['selected-color']">{{ $attrs.text }}</p>
  </a>
</template>
<script>
export default {
  name: 'mk-nav-item',
  data () {
    return {
    }
  },
  computed: {
    num () {
      let num = this.$attrs['icon-num']
      if (num) {
        num = num.toString()
        num = num.length > 2 ? '99+' : num
      }
      return num
    }
  },
  methods: {
    onSelected (e) {
      this.$emit('selected', {e: e, this: this})
    }
  }
}
</script>
<style scoped lang="scss">
  .mk-nav-item {
    @include box-pack(center);
    @include box-flex(1);
    width:100%;
    height: 100px;
    display: block;
    text-align: center;
    //line-height: 30px;
    //padding-top: 18px;
    text-decoration:none;
    em {
      font-style: normal;
    }
    .icon {
      font-size: 50px;
      position: relative;
      display: block;
      margin:10px 0px 0px;
      height:50px;
      line-height:50px;
      overflow:hidden;
      img {
        max-width: 50px;
        max-height: 50px;
      }
    }
    p{
      display:block;
      margin:0px;
      height:40px;
      line-height:40px;
      font-size: 20px;
    }
    .box-1 {
      display: block;
    }
    .box-2 {
      display: none;
    }
    &.selected {
      // color:#fe7773;
      font-size:18px;
      .box-1 {
        display: none;
      }
      .box-2 {
        display: block;
      }
    }
  }
  .mod-buy-num {
    position: absolute;
    top: 0px;
    left: 56%;
    display: block;
    min-width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    color: #fff;
    background-color: #fe7773;
    border-radius: 10px;
    font-size: 20px;
    font-family: sans-serif;
    transform:scale(1);
    transition:.3s;
    padding:0px 5px;

    &:empty {
      opacity: 0;
      transform:scale(.1);
    }
  }
  .mod-dot {
    position: absolute;
    top: 0px;
    left: 56%;
    display: block;
    width: 12px;
    height:12px;
    line-height: 12px;
    text-align: center;
    color: #fff;
    background-color: #ff5000;
    border-radius: 50%;
  }
</style>
