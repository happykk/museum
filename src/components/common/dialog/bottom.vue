<template>
	<div ref="dialog" :style="{display: isShow?'block':'none', zIndex:zIndex}" :id="id" class="mod-wrap">
    <div :class="['mk-pop-bottom', 'ui-animated', speedClass, popClass]"  :style="{background: $attrs.background}">
			<div class="inner" v-html="ctn" v-if="ctn.length!=0"></div>
			<div class="inner" v-if="ctn.length==0">
				<slot name="ctn"></slot>
			</div>
		</div>
		<div :class="['mk-layer-mask', maskClass]" @click="maskClose" ref="mask"></div>
	</div>
</template>
<script>
import { modalHelper } from './dom'
import { getZIndex } from './util'
export default {
  name: 'mk-pop-bottom',
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
      isMaskClose: true,
      zIndex: 10,

      maskClass: '',
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
      this.maskClass = 'mk-layer-mask-hover'
      this.popClass = this.showClass
      this.isShow = true
      this.onShow(this)
      getZIndex(this, this.$refs.dialog.style.zIndex, (max) => {
        this.zIndex = max
      })
      this.$nextTick(() => {
        this.$refs.mask.addEventListener('touchmove', (e) => {
          e.preventDefault()
          return false
        })
        modalHelper.show()
      })
      return this
    },
    hide (flag) {
      this.maskClass = ''
      this.popClass = this.hideClass
      setTimeout(() => {
        this.isShow = false
        flag && this.$refs.dialog.remove()
        this.$emit('hidden', this)
        modalHelper.hide()
      }, 200)
      return this
    },
    maskClose () {
      this.isMaskClose && this.hide(this.isRemove)
    }
  },
  mounted () {
    Object.assign(this.$data, this.options)
    // document.body.append(this.$refs.dialog)
  }
}
</script>
<style lang="scss" scoped>
	.mod-wrap {
		position:fixed;
		top:0px;
		left:0px;
		right:0px;
		bottom:0px;
	}
	.mk-pop-bottom {
		//top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		// background: #fff;
		overflow: auto;
		position:fixed;
		z-index:1;
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
	.mk-layer-mask {
		opacity:0;
		transition:opacity 0.2s linear;
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		overflow: hidden;
		user-select: none;
		background-color: rgb(0, 0, 0);
	}

	.mk-layer-mask-hover {
		opacity:0.3;
	}
</style>
