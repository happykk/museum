<template>
  <div :class="['mod-select-pop', !text || text.length === 0 ? 'disabled' : '']">
    <div class="inner" >
      <span class="placeholder" v-if="isEmpty(text)" @click="show()">请选择</span>
      <span @click="show()" v-if="!isEmpty(text)">{{ text }}</span>
      <i class="iconfontcom" v-if="isEmpty(text)"  @click="show()">&#xe610;</i>
      <i class="iconfontcom" v-if="!isEmpty(text) && !hideClear" @click="reset()">&#xe609;</i>
    </div>
  </div>
</template>
<script>
  export default {
    props: [ 'options', 'selectedValue' ],
    data () {
      return {
        hideClear: false,
        splitter: ',' // 分隔符
      }
    },
    computed: {
      text () {
        let text = []
        this.selectedValue.forEach((item1, index1) => {
          let list = this.options.lists[index1]
          list = list ? list.list : false
          list && list.forEach((item, index) => {
            if (item.value === item1) {
              text.push(item.text)
              return false
            }
          })
        })
        return text.join(this.splitter)
      }
    },
    model: {
      prop: 'selectedValue',
      event: 'update'
    },
    methods: {
      show () {
        this.$emit('show')
      },
      isEmpty (val) {
        if (!val) {
          return true
        }
        if (typeof val === 'string') {
          return val.length === 0
        }
        return val.join(',').replace(/,/g, '').length === 0
      },
      clearData () {
        let ar = this.selectedValue
        let len = ar.length
        for (let i = 0; i < len; i++) {
          this.$delete(this.selectedValue, 0)
        }
      },
      reset () {
        this.$emit('clear')
        this.clearData()
        // this.$emit('update', this.ar)
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

.mod-select-pop {
  width: 100%;
  display:inline-block;
  font-size:28px;
  height:60px;
  border-radius:$inpur_radius;
  @include display-box();
  @include box-align(center);
  background: #eee;
  &.disabled {
    background: #eee;
  }
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
</style>
