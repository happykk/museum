<template>
  <div class="mk-search">
    <div class="search-inner">
      <i class="icon iconfontcom">&#xe625;</i>
      <input type="text" :placeholder="$attrs.placeholder" :value="value" @input="onChange" @keyup.enter="enter"/>
      <i class="clear iconfontcom" v-if="value && value.length !== 0" @click="clear">&#xe609;</i>
    </div>
    <div class="cancel" v-if="!$attrs['hidden-cancel']" @click="$emit('cancel')">取消</div>
    <!-- <div class="search-mask">&nbsp;</div> -->
  </div>
</template>
<script>
  export default {
    name: 'mk-search',
    props: ['value', 'placeholder', 'hidden-cancel'],
    model: {
      prop: 'value',
      event: 'update'
    },
    computed: {
      $attrs () {
        return {
          placeholder: this.placeholder,
          'hidden-cancel': this['hidden-cancel']
        }
      }
    },
    methods: {
      enter () {
        this.$emit('enter', {value: this.value})
      },
      onChange (e) {
        let value = e.target.value
        this.$emit('change', e)
        this.$emit('update', value)
      },
      clear () {
        this.$emit('update', '')
        this.$emit('clear')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mk-search {
    @include display-box();
    @include box-align(center);
    height: 113px;
    background: #fff;
    position:relative;
    padding: 0 24px;
    // box-sizing: border-box;
    .search-inner {
      box-sizing: border-box;
      height: 72px;
      background: #eee;
      border-radius: 36px;
      @include box-flex(1);
      @include display-box();
      @include box-align(center);
      padding:0 30px 0 20px;
      .icon {
        display:block;
        width: 38px;
        font-size: 30px;
        color: #999;
        position:relative;
        top: rem(-3);
      }
      .clear {
        display:block;
        font-size: 30px;
        color: #999;
        width: 30px;
        position:relative;
        right: rem(-10);
      }
      input {
        font-size: 24px;
        box-sizing: border-box;
        display:block;
        border: 0px;
        height: 72px;
        background: #eee;
        @include box-flex(1);
      }
    }
    .cancel {
      width: 80px;
      text-align: right;
      font-size: 30px;
    }
    .search-mask {
      position:fixed;
      left:0px;
      right:0px;
      top: 100px;
      bottom:0px;
      background: rgba(0,0,0,0.5);
    }
  }
</style>
