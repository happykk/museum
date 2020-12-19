<template>
  <div :class="['mk-tabs-item', selectedClass]" @click="change" ref="tab">
    <div class="item-label-span"><slot name="tab">{{ $attrs.label }}</slot></div>
    <div class="ctn-item" ref="ctn" :style="{display: selected ? 'block' : 'none'}"><slot></slot></div>
  </div>
</template>
<script>
  export default {
    name: 'mk-tabs-item',
    computed: {
      selected () {
        return (this.$parent.value.toString() === this.$attrs.name.toString())
      },
      selectedClass () {
        return (this.selected ? (this.$parent.$attrs['selected-class'] || 'selected') : '')
      }
    },
    methods: {
      change (e) {
        this.$parent.$emit('update', this.$attrs.name)
        this.$parent.$emit('tab-click', {e})
        this.$emit('tab-click', {e: e})
      },
      setSelectedIndex () {
        if (this.selected) {
          this.$parent.selectedIndex = Array.from(this.$parent.$el.getElementsByClassName('mk-tabs-item')).indexOf(this.$el)
        }
      }
    },
    watch: {
      '$parent.value' () {
        this.setSelectedIndex()
      }
    },
    mounted () {
      let tab = document.getElementById(this.$attrs['tab-id'])
      let ctn = document.getElementById(this.$attrs['ctn-id'])
      if (tab) {
        tab.appendChild(this.$refs.tab)
      }
      if (ctn) {
        ctn.appendChild(this.$refs.ctn)
      } else {
        this.$parent.$refs.ctns.appendChild(this.$refs.ctn)
      }
      this.setSelectedIndex()
    }
  }
</script>
<style lang="scss" scoped>
  .mk-tabs-item {
    .item-label-span {
      display: inline-block;
    }
  }
</style>
