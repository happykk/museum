<template>
  <div class="mod-select-pop">
    <div :class="['item-title', 'pos-' + position]">{{ title }}</div>
    <div class="item-inner" :style="{ height: liHeight * row  + 'px'}" ref="selectPop">
      <ul :class="['pos-' + position]">
        <li v-for="item in Math.floor(row/2)" :style="{ height: liHeight + 'px', lineHeight: liHeight + 'px' }"></li>
        <li v-for="item in list" :key="item.value" :style="{ height: liHeight  + 'px', lineHeight: liHeight + 'px'}">{{ item.text }}</li>
        <li v-for="item in Math.floor(row/2)" :style="{ height: liHeight  + 'px', lineHeight: liHeight + 'px'}"></li>
      </ul>
      <div class="item-mask">
        <span :style="{height: Math.floor(row/2) * liHeight + 'px'}"></span>
        <span :style="{ height: Math.floor(row/2) * liHeight + 'px'}"></span>
      </div>
    </div>
  </div>
</template>
<script>
import IScroll from 'iscroll/build/iscroll-probe'
var liHeight = parseInt(getPx(80))
function getPx (val) {
  // var fontSize = 16
  const fontSize = 46.875
  const scale = val / fontSize
  const htmlFontSize = document.documentElement.style.fontSize.replace('px', '')
  return parseInt(scale * htmlFontSize)
}
export default {
  name: 'mk-select',
  props: ['options', 'selectedValue'],
  model: {
    prop: 'selectedValue',
    event: 'update'
  },
  data () {
    return {
      defaultValue: '', // 默认值
      list: [],
      title: '',
      position: 'center',
      row: 3,
      liHeight: liHeight,
      // private
      myScroll: false
    }
  },
  methods: {
    init () {
      this.$nextTick(() => {
        if (!this.myScroll) {
          this.scroll()
        } else {
          this.myScroll.refresh()
        }
        this.myScroll.scrollTo(0, parseFloat('-' + (this.getSelectedIndex() * liHeight)))
      })
    },
    scrollTo (index) {
      this.myScroll.scrollTo(0, parseFloat('-' + (index * liHeight)))
    },
    getSelectedIndex () {
      let selectedIndex = 0
      let compareValue = this.selectedValue ? this.selectedValue : this.defaultValue
      for (let index = 0; index < this.list.length; index++) {
        let item = this.list[index]
        if (compareValue && (item.value.toString() === compareValue)) {
          selectedIndex = index
          break
        }
      }
      return selectedIndex
    },
    scroll () {
      let self = this
      this.myScroll = new IScroll(this.$refs.selectPop, {
        disablePointer: true,
        disableTouch: false,
        disableMouse: false,
        scrollY: true,
        probeType: 2
      })
      this.myScroll.on('scrollEnd', function () {
        // scrollTo pos ----
        var y = Math.abs(this.y)
        var diffY = y % liHeight
        var lastY = 0
        var index = 0
        if (diffY >= liHeight / 2) {
          index = Math.ceil(y / liHeight)
        } else {
          index = Math.floor(y / liHeight)
        }
        lastY = index * liHeight
        self.myScroll.scrollTo(0, -lastY)

        // selected option
        var _index = index + (Math.ceil(self.row / 2) - 1)
        let item = self.list[_index - Math.floor(self.row / 2)]
        self.$emit('update', item.value)

        // scoll next ----
        var top = (self.list.length - 1) * liHeight
        if (top === lastY) {
          self.$emit('scrollBottom')
        }
        self.$emit('scrollEnd')
      })
    },
    // 设置lists 数据 [{value: 1, text: 1}]
    setList (val) {
      this.$set(this, 'list', val)
      this.$nextTick(() => {
        this.init()
      })
    }
  },
  created () {
    Object.assign(this.$data, this.options)
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.mod-select-pop {
  @include box-flex(1);
  overflow:hidden;
  position:relative;
  width:100%;
  touch-action: none;
  position:relative;
  @include display-box();
  overflow:hidden;
  .item-title {
    position:absolute;
    top:0px;
    height:60px;
    width:100%;
    z-index:1;
    background:#fff;
  }
  .item-inner {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    @include box-flex(1);
    position:relative;
    // margin-top:60px;
  }
  .item-mask{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    span:nth-child(1), span:nth-child(2) {
      display:block;
      position:absolute;
      left:0px;
      top:0px;
      width:100%;
      background:#fff;
      opacity: 0.8;
      content:'';
      border-bottom:1px solid #ccc; /*no*/
    }
    span:nth-child(2) {
      top:auto;
      bottom: 0px;
      border-top:1px solid #ccc; /*no*/
      border-bottom:0px;
    }
  }
  ul {
    overflow:hidden;
    display:block;
    li {
      display:block;
      // height:60px;
      // line-height:60px;
      font-size: 40px;
      color:#333;
      transition:all 0.1s ease-in;
      text-align:left;
      &.selected {
        font-size:30px;
      }
    }
  }
  .pos-center {
    text-align:center!important;
    li {
      text-align:center!important;
    }
  }
}
</style>
