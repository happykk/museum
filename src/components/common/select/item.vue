<template>
  <div class="mk-select-pop-item">
    <div :class="['item-title', 'pos-' + position]">{{ $attrs.title }}</div>
    <div class="item-inner" :style="{ height: liHeight * row  + 'px'}" ref="selectPop">
      <ul :class="['pos-' + position]">
        <li v-for="item in Math.floor(row/2)" :style="{ height: liHeight + 'px', lineHeight: liHeight + 'px' }"></li>
        <li v-for="(item, index) in list" :key="index" :style="{ height: liHeight  + 'px', lineHeight: liHeight + 'px'}">{{ item.text }}</li>
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
  props: ['options', 'selectedValue'],
  name: 'mk-select-pop-item',
  model: {
    prop: 'selectedValue',
    event: 'update'
  },
  data () {
    return {
      indexMap: {},
      listMap: {},
      liHeight: liHeight,
      // private
      myScroll: false
    }
  },
  computed: {
    list () {
      return this.options.data
    },
    position () {
      return this.$attrs.position || 'center'
    },
    row () {
      return this.$attrs.row || 3
    }
  },
  watch: {
    '$parent.isShow' () {
      this.setInitData()
    },
    list () {
      this.setInitData()
    }
  },
  methods: {
    setInitData () {
      this.listMap = this.getListMap()
      if (this.list.length !== 0) {
        // selectedValue 同步defaultValue or list的第一条数据
        if (!this.selectedValue) {
          if (this.$attrs['default-value'] !== undefined) {
            this.listMap[this.$attrs['default-value']] && this.$emit('update', this.listMap[this.$attrs['default-value']])
          } else {
            this.listMap[this.list[0].value] && this.$emit('update', this.listMap[this.list[0].value])
          }
        } else {
          if ((typeof this.selectedValue).toLowerCase() !== 'object' && !this.options.onlyReturnValue) {
            // selectedValue 同步格式化的初始数据
            this.listMap[this.selectedValue] && this.$emit('update', this.listMap[this.selectedValue])
          } else if (this.myScroll) {
            // selectedValue 同步当前滚动选中的数据
            let index = this.list.map((item) => { return item.value }).indexOf(this.selectedValue.value || this.selectedValue)
            index = index < 0 ? 0 : index
            if (this.list[index]) {
              let value = this.list[index]['value']
              let v = ((typeof this.selectedValue).toLowerCase() === 'object' ? this.selectedValue.value : this.selectedValue)
              if (v !== value) {
                this.listMap[value] && this.$emit('update', this.listMap[value])
              }
            }
          }
        }
      }
      //
      this.$nextTick(() => {
        if (!this.myScroll) {
          this.scroll()
        } else {
          this.myScroll.refresh()
        }
        this.myScroll.scrollTo(0, parseFloat('-' + (this.getSelectedIndex() * liHeight)))
      })
    },
    getListMap () {
      let obj = {}
      this.list.forEach((item, index) => {
        this.indexMap[item.value] = index
        if (this.options.onlyReturnValue) {
          obj[item.value] = item.value
        } else {
          obj[item.value] = item
        }
      })
      return obj
    },
    getSelectedIndex () {
      let selectedValue = this.selectedValue
      if ((typeof selectedValue).toLowerCase() === 'object' && selectedValue.value !== undefined) {
        selectedValue = selectedValue.value
      }
      return this.indexMap[selectedValue]
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
      this.myScroll.on('scroll', () => {
        this.$parent.$parent.disabledSure = true
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
        self.$emit('update', self.listMap[item.value])

        // scoll next ----
        var top = (self.list.length - 1) * liHeight
        if (top === lastY) {
          self.$emit('scrollBottom')
        }
        self.$parent.$parent.disabledSure = false
        self.$emit('scrollEnd', {instance: this})
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
  .mk-select-pop-item {
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
      transform: translateZ(0px);
      z-index:1;
      background:#fff;
      font-size: 30px;
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
      transform: translateZ(0px);
      span:nth-child(1), span:nth-child(2) {
        display:block;
        position:absolute;
        left:0px;
        top:0px;
        width:100%;
        background:#fff;
        opacity: 0.8;
        content:'';
        border-bottom:1px solid #eee; /*no*/
      }
      span:nth-child(2) {
        top:auto;
        bottom: 0px;
        border-top:1px solid #eee; /*no*/
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
