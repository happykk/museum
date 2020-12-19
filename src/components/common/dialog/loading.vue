<template>
	<div ref="dialog" :style="{display: isShow?'block':'none', zIndex:zIndex}" :id="id" class="mod-wrap">
		<div :class="['mk-layer-mask', maskClass]" @click="maskClose" ref="mask"></div>
		<div :class="['mk-pop-loading', 'ui-animated', speedClass, popClass]" ref="pop">
			<div class="inner">
				<div class="pop-bd">
					<div class="img"><img :src="loadingImg"/></div>
				 <div class="text" v-html="ctn" v-if="ctn.length!=0"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { getStyle, setStyle, modalHelper } from './dom'
import { getZIndex } from './util'
export default {
  name: 'mk-pop-loading',
  props: ['options'],
  data () {
    return {
      id: '',
      top: '30%',
      loadingImg: require('./img/loading.gif'),
      showClass: 'ui-ani-bounceIn',
      hideClass: 'ui-ani-bounceOut',
      speedClass: 'ui-speed-fast',
      appendToElement: 'body',
      ctn: '',
      onShow: function () {},
      isMaskClose: false,
      zIndex: 10,
      //
      maskClass: '',
      popClass: '',
      isShow: false
    }
  },
  methods: {
    create () {
      this.appendToElement.length !== 0 && document.querySelector(this.appendToElement).appendChild(this.$refs.dialog)
    },
    setPos () {
      this.$nextTick(() => {
        var pop = this.$refs.pop
        var height = getStyle(pop, 'height').replace('px', '')
        var width = getStyle(pop, 'width').replace('px', '')
        setStyle(pop, 'top', (this.top.length !== 0 ? this.top : '50%'))
        setStyle(pop, 'left', '50%')
        setStyle(pop, 'margin-left', '-' + (width / 2) + 'px')
        this.top.length === 0 && setStyle(pop, 'margin-top', '-' + (height / 2) + 'px')
      })
    },
    show () {
      this.create()
      this.$off(['hidden'])
      this.maskClass = 'mk-layer-mask-hover'
      this.popClass = this.showClass
      this.isShow = true
      this.setPos()
      this.$emit('shown', this)
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
    },
    hide () {
      this.maskClass = ''
      this.popClass = this.hideClass
      setTimeout(() => {
        this.isShow = false
        this.$refs.dialog.remove()
        this.$emit('hidden', this)
        modalHelper.hide()
      }, 200)
    },
    maskClose () {
      this.isMaskClose && this.hide()
    }
  },
  mounted () {
    Object.assign(this.$data, this.options)
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
	.mk-pop-loading {
		box-sizing: border-box;
		font: 300 1rem/1rem "Helvetica Neue", Helvetica, Arial,STHeiTi, sans-serif, "microsoft yahei";
		border-radius: 10px;
		font-size:28px;
		position:fixed;
		overflow:hidden;
		background:#f2f3f7;
		padding:0px;
		min-width:auto;
		max-width:600px;
		.inner {
		}
		.pop-bd {
			color:#333;
			margin:20px 30px;
			@include display-box();
			@include box-pack(center);
			@include box-align(center);
			.img {
				width:32px;
				height:32px;
				line-height:32px;
				img {
					width:32px;
					height:32px;
					overflow:hidden;
				}
			}
			.text {
				line-height:32px;
				margin-left:8px;
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
