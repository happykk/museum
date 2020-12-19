<template>
  <div :class="['mk-full-screen', 'ui-animated', speedClass, popClass]" ref="dialog" :style="{display: isShow?'block':'none', zIndex:zIndex, background: $attrs.background}" :id="id">
		<a class="close iconfontcom" v-if="!hideClose" @click="hide(isRemove)">&#xe607;</a>
		<div class="inner" v-html="ctn" v-if="ctn.length!=0"></div>
		<div class="inner" v-if="ctn.length==0">
			<slot name="ctn"></slot>
		</div>
	</div>
</template>
<script>
import { modalHelper } from './dom'
import { getZIndex } from './util'
export default {
  name: 'mk-full-screen',
  props: ['options'],
  data () {
    return {
      id: '',
      ctn: '',
      showClass: 'ui-ani-fadeInUp',
      hideClass: 'ui-ani-fadeOutDown',
      speedClass: 'ui-speed-fast',
      isShow: false,
      appendToElement: 'body',
      hideClose: false,
      onShow: function () {},
      isRemove: false,
      //
      zIndex: 10,
      popClass: ''
    }
  },
  methods: {
    create () {
      this.appendToElement.length !== 0 && document.querySelector(this.appendToElement).appendChild(this.$refs.dialog)
    },
    show (flag) {
      (flag || this.isRemove) && this.create()
      // this.$off(['hidden', 'close'])
      this.popClass = this.showClass
      this.isShow = true
      this.onShow(this)
      getZIndex(this, this.$refs.dialog.style.zIndex, (max) => {
        this.zIndex = max
      })
      modalHelper.show()
      return this
    },
    hide (flag) {
      this.popClass = this.hideClass
      setTimeout(() => {
        this.isShow = false
        flag && this.$refs.dialog.remove()
        this.$emit('hidden', this)
        modalHelper.hide()
      }, 200)
      return this
    }
  },
  mounted () {
    Object.assign(this.$data, this.options)
    // document.body.append(this.$refs.dialog)
  }
}
</script>
<style lang="scss" scoped>
	.mk-full-screen {
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		// background: #fff;
		overflow: auto;
		position:fixed;
		.close {
			position: fixed;
			top: 20px;
			right: 20px;
			font-size: 60px;
			background:rgba(204,204,204,0.6);
			width:100px;
			height:100px;
			line-height:110px;
			text-align:center;
			border-radius:50px;
			color:#fff;
			&:after {
				font-size:40px;
				height:40px;
				line-height:40px;
				width:40px;
				overflow:hidden;
				vertical-align:middle;
			}
		}
	}
</style>
