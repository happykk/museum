<template>
  <div class="mk-select-pop">
    <mk-pop-bottom  ref="bottom" :options="{}">
      <div :class="['mod-select-scroll']" slot="ctn">
        <div class="scroll-hd">
          <span class="btn" @click="cancel()">取消</span>
          <button class="btn" @click="sure()" ref="sureBtn" type="button">确定</button>
        </div>
        <div class="scroll-bd">
          <slot></slot>
        </div>
      </div>
    </mk-pop-bottom>
  </div>
</template>
<script>
  import '../dialog/animate.scss'
  import Bottom from '../dialog/bottom.vue'
  export default {
    name: 'mk-select-pop',
    components: { 'mk-pop-bottom': Bottom },
    props: [ 'options', 'selectedValue' ],
    model: {
      prop: 'selectedValue',
      event: 'update'
    },
    data () {
      return {
        disabledSure: false,
        isShow: false
      }
    },
    watch: {
      disabledSure () {
        if (this.disabledSure) {
          this.$refs.sureBtn.setAttribute('disabled', 'disabled')
        } else {
          this.$refs.sureBtn.removeAttribute('disabled')
        }
      }
    },
    methods: {
      show () {
        this.$refs.bottom.show()
        this.$emit('shown')
        this.isShow = true
      },
      cancel () {
        this.$refs.bottom.hide()
        this.$emit('cancel')
        this.isShow = false
      },
      sure () {
        this.$refs.bottom.hide()
        this.$emit('sure')
      }
    },
    created () {
      Object.assign(this.$data, this.options)
    }
  }
</script>
<style lang="scss" scoped>
.mk-select-pop {
  display:inline-block;
  font-size:28px;
  background: #fff;
}
.mod-select-scroll {
  background: #fff;
  .scroll-hd {
    height:84px;
    @include display-box();
    @include box-align(center);
    @include box-pack(justify);
    justify-content: space-between;
    border-bottom:1px solid #e2e2e2; /*no*/
    .btn {
      display: block;
      padding: 0 26px;
      font-size: 30px;
      border: 0;
      background: none;
      &:nth-child(2) {
        color: #00a4eb;
      }
      &:disabled {
        color: #eee;
      }
    }
  }
  .scroll-bd {
    @include display-box();
    position:relative;
    padding:20px 30px;
  }
}
.mod-select-scroll-3{
  height: 180px;
}

.mod-select-scroll-5{
  height: 300px;
}
</style>
