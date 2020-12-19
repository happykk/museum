<template>
  <div :class="['mk-select', 'mk-select-' + $attrs['type'], !selectedValue || selectedValue.length === 0 ? 'disabled' : '']">
    <div class="inner" >
      <span class="placeholder" v-if="isEmpty(selectedValue)" @click="show()">请选择</span>
      <span @click="show()" v-if="!isEmpty(selectedValue)">{{ selectedValue }}</span>
      <i class="iconfontcom" v-if="isEmpty(selectedValue)"  @click="show()">&#xe610;</i>
      <i class="iconfontcom" v-if="!isEmpty(selectedValue) && !hideClear" @click="reset()">&#xe609;</i>
    </div>
  </div>
</template>
<script>
  export default {
    props: [ 'options', 'selectedValue' ],
    name: 'mk-select',
    data () {
      return {
        hideClear: false,
        splitter: ',' // 分隔符
      }
    },
    model: {
      prop: 'selectedValue',
      event: 'update'
    },
    methods: {
      show () {
        this.$emit('click')
      },
      isEmpty (val) {
        if (!val) {
          return true
        }
        return val.toString().length === 0
      },
      clearData () {
        this.$emit('update', '')
      },
      reset () {
        this.$emit('clear')
        this.clearData()
      }
    },
    created () {
      Object.assign(this.$data, this.options)
    }
  }
</script>
<style lang="scss" scoped>
$input_bg: #eff9fe;
$input_border_color: none;
$inpur_radius: 10px;

.mk-select {
  width: 100%;
  display:inline-block;
  @include display-box();
  @include box-align(center);
  .inner {
    @include display-box();
    @include box-align(center);
    @include box-flex(1);
    height:100%;
    span {
      @include box-flex(1);
      color:#333;
      padding-right:10px;
      display:block;
      padding-left:20px;
    }
    .placeholder {
      color:#ccc;
    }
    i {
      color:#c0c0c0;
      padding-right:16px;
    }
  }
}
.mk-select-primary {
  font-size:28px;
  height:60px;
  border-radius:$inpur_radius;
  background: #eee;
  &.disabled {
    background: #eee;
  }
}
</style>
