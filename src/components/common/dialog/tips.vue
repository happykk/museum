<template>
	<div ref="dialog" :style="{display: isShow?'block':'none'}" :id="id" >
		<div :class="['mk-pop-tips', 'ui-animated', speedClass, popClass]" ref="pop" :style="{zIndex:zIndex}">
			<div class="inner">
				<div class="pop-bd">
          <div :class="['icon', 'iconfontcom', iconClass]" v-if="iconClass.length!=0"></div>
          <div class="text" v-html="ctn" v-if="ctn.length!=0"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { getStyle, setStyle } from './dom'
import { getZIndex } from './util'
export default {
  name: 'mk-pop-loading',
  props: ['options'],
  data () {
    return {
      id: '',
      top: '30%',
      iconClass: '',
      showClass: 'ui-ani-fadeInUp',
      hideClass: 'ui-ani-bounceOut',
      speedClass: 'ui-speed-normal',
      appendToElement: 'body',
      ctn: '',
      onShow: function () {},
      delay: 2000,
      zIndex: 10,
      //
      popClass: '',
      delayItem: '',
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
      this.popClass = this.showClass
      this.isShow = true
      this.setPos()
      this.$emit('shown', this)
      this.onShow(this)
      getZIndex(this, this.$refs.dialog.style.zIndex, (max) => {
        this.zIndex = max
      })
      clearTimeout(this.delayItem)
      this.delayItem = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide () {
      this.popClass = this.hideClass
      setTimeout(() => {
        this.isShow = false
        this.$refs.dialog.remove()
        this.$emit('hidden', this)
      }, 200)
    }
  },
  mounted () {
    Object.assign(this.$data, this.options)
  }
}
</script>
<style lang="scss" scoped>
	.mk-pop-tips {
		box-sizing: border-box;
		font: 300 1rem/1rem "Helvetica Neue", Helvetica, Arial,STHeiTi, sans-serif, "microsoft yahei";
		border-radius: 10px;
		font-size:28px;
		position:fixed;
		overflow:hidden;
		background:rgba(81,81,83,0.8);
		padding:0px;
		min-width:auto;
		max-width:600px;
		.inner {
		}
		.pop-bd {
			color:#fff;
			margin:10px 30px;
			@include display-box();
			@include box-pack(center);
			@include box-align(center);
			.text {
			}
			.icon {
				font-size:40px;
				width:40px;
				height:40px;
				overflow:hidden;
				margin-right:6px;
				&:after {
					display:block;
          height: 40px;
          line-height: 40px;
          overflow:hidden;
				}
				&.success {
					&:after {
						content:'\e608';
						//color:#67c23a;
					}
				}
				&.error{
					&:after {
						content:'\e609';
						//color:#f56c6c;
					}
				}
				&.warn{
					&:after {
						content:'\e60b';
						//color:#e6a23c;
					}
				}
			}
		}
	}
</style>
