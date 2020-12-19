<template>
	<div ref="dialog" :style="{display: isShow?'block':'none', zIndex:zIndex}" :id="id" class="mod-wrap">
		<div :class="['mk-layer-mask', maskClass]" @click="maskClose" ref="mask"></div>

		<!-- primary -->
		<div :class="['mk-box', 'ui-animated', speedClass, popClass]" ref="pop" v-if="type=='primary'">
			<slot name="ctn"></slot>
		</div>

		<!-- main -->
		<div :class="['mk-box', 'mk-pop', 'ui-animated', speedClass, popClass]" ref="pop" v-if="type=='main'">
			<div class="inner">
				<div class="pop-close iconfontcom tap-lt" @click="hide(isRemove)" v-if="!hideClose"></div>
				<div class="pop-hd" v-if="title.length!=0">{{ title }}</div>

				<div class="pop-bd" v-html="ctn" v-if="ctn.length!=0">
				</div>
				<div class="pop-bd" v-if="ctn.length==0">
					<slot name="ctn"></slot>
				</div>

				<div class="pop-ft">
					<a class="btn tap-lt" v-if="cancelValue.length!=0" @click="cancelFun">{{ cancelValue }}</a>
					<a :class="['btn', 'tap-lt', cancelValue.length==0?'only':'']" @click="okFun">{{ okValue }}</a>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { getStyle, setStyle, modalHelper } from './dom'
import { getZIndex } from './util'
export default {
  name: 'mk-pop',
  props: ['options'],
  data () {
    return {
      id: '',
      top: '',
      zIndex: 10,
      showClass: 'ui-ani-bounceIn',
      hideClass: 'ui-ani-bounceOut',
      speedClass: 'ui-speed-fast',
      title: 'title',
      cancelValue: '取消',
      okValue: '确定',
      appendToElement: 'body',
      ctn: '',
      hideClose: false,
      onShow: function () {},
      isRemove: false,
      isMaskClose: true,
      type: 'primary',
      //
      forbidClose: false,
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
    show (flag) {
      (flag || this.isRemove) && this.create()
      // 避免 alert, confirm 触发多次
      if (this.type === 'main') {
        this.$off(['hidden', 'shown', 'cancel', 'sure'])
      }
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
    disabledClose () {
      this.forbidClose = true
    },
    enableClose () {
      this.forbidClose = false
    },
    cancelFun () {
      this.$emit('cancel', this)
      this.hide(this.isRemove)
    },
    okFun () {
      this.$emit('sure', this)
      if (this.forbidClose) { return }
      this.hide(this.isRemove)
    },
    maskClose () {
      this.isMaskClose && this.hide(this.isRemove)
    }
  },
  mounted () {
    this.forbidClose = false
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
	.mk-box {
		box-sizing: border-box;
		font: 300 1rem/1rem "Helvetica Neue", Helvetica, Arial,STHeiTi, sans-serif, "microsoft yahei";
		position:fixed;
	}
	.mk-pop {
		background: #fff;
		border-radius: 10px;
		min-width: 500px;
		font-size:28px;
		padding-top:40px;
		.inner {
			//margin-top:40px;
		}
		.pop-close {
			@extend %ui-pop-close;
		}
		.pop-hd {
			text-align:center;
			margin-bottom:10px;
		}
		.pop-bd {
			margin: 0px 40px 40px;
			font-size:30px;
			line-height:40px;
			text-align:center;
			color:#666666;
		}
		.pop-ft {
			margin: 0px auto;
			@include display-box();
			border-top:1px solid #f6f6f6; /*no*/
			.ui-button {
				border-radius: 10px;
				margin-top: 30px;
				font-size:30px;
				height:90px;
				line-height:90px;
			}
			.btn {
				@include box-flex(1);
				width:100%;
				display:block;
				text-align:center;
				font-size:30px;
				height:80px;
				line-height:80px;
				color: #333;
				&:nth-child(2), &.only {
					border-left:1px solid #f6f6f6; /*no*/
					color: #f95d5b;
				}
        &.only {
          border: 0px;
        }
			}
		}
	}
	%ui-pop-close {
		width: 44px;
		height: 44px;
		text-align:center;
		line-height: 44px;
		position: absolute;
		top: 20px;
		right: 20px;
		border:1px solid #f7f7f7; /*no*/
		border-radius:150%;
		&:after {
			display:inline-block;
			font-size: 30px;
			color: #ccc;
			margin-top:4px;
			font-family:'iconfontcom';
			content:'\e607';
		}
	}

	.mk-pop-bottom {
		bottom: 0px;
		top: auto!important;
		width:100%;
	}

	.mk-pop-left {
		bottom:0px;
		top: 0px!important;
		right:auto!important;
		left:0px!important;
		background:#fff;
	}

	.mk-pop-select {
		text-align:center;
		padding:20px;
		ul {
			border-radius:10px;
			background:#fff;
			li {
				height:76px;
				line-height:76px;
				border-bottom:1px solid #ccc; /*no*/
				font-size:28px;
				&:last-child {
					border-bottom:0px;
				}
			}
		}
		.ui-btn {
			margin:20px 0 0 0;
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
	.tap-lt:active {
		background-color:#f5f6f8;
		text-decoration:none
	}
</style>
