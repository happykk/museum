<template>
  <div :class="['mk-tabs','mk-tabs-' + ($attrs['type'] || '') ]" ref="tabs">
    <div class="tabs-label">
      <slot></slot>
      <div class="tabs-line" v-if="$attrs['type'] === 'line'">
        <div class="mk-selected-line" ref="line" :style="{'background-color': $attrs['line-bg-color'] || '#ccc'}"></div>
      </div>
    </div>
    <slot name="middle"></slot>
    <div class="tabs-ctn" ref="ctns">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'mk-tabs',
    props: ['value'],
    model: {
      prop: 'value',
      event: 'update'
    },
    data () {
      return {
        selectedIndex: 0,
        ctns: {}
      }
    },
    methods: {
      setLine () {
        this.$nextTick(() => {
          if (this.$refs.line) {
            let linePos = this.getLinePos()
            let width = linePos.width
            if (this.$attrs['line-type'] === 'short') {
              this.$refs.line.style.left = linePos.distance + ((width * 0.4) / 2) + 'px'
              this.$refs.line.style.width = width * 0.6 + 'px'
            } else {
              this.$refs.line.style.left = linePos.distance + 'px'
              this.$refs.line.style.width = width + 'px'
            }
          }
        })
      },
      getLinePos () {
        let spans = Array.from(this.$refs.tabs.getElementsByClassName('item-label-span'))
        let index = this.selectedIndex
        let width = spans[index].clientWidth
        let offsetLeft = spans[index].offsetLeft
        let distance = 0
        distance = offsetLeft
        return { width, distance }
      }
    },
    watch: {
      value () {
        this.setLine()
      }
    },
    mounted () {
      this.setLine()
    }
  }
</script>
<style lang="scss" scoped>
  .mk-tabs {
    .tabs-label {
      box-sizing:border-box;
      position: relative;
      @include display-box();
      .tabs-line {
        height: 2px;
        // background: #ccc;
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
      }
    }
    .tabs-ctn {
      .ctn-item {
        display: none;
      }
    }
  }
  .mk-selected-line {
    height: 6px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    transition:.3s ease-in-out;
    border-radius: 5px;
  }
</style>
