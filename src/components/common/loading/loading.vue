<template>
	<div :class="[customClass]" ref="loading" v-if="visible">
		<div class="mod-loading-mask"></div>
		<div :class="['mod-loading', text.length==0?'no-txt':'']">
			<p><Icon></Icon></p>
			<p class="loading-txt" v-if="text.length!=0">{{ text }}</p>
		</div>
	</div>
</template>
<script>
import Icon from './icon.vue'
export default {
  components: {Icon},
  data () {
    return {
      text: null,
      visible: false,
      customClass: ''
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    hide () {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
	.mod-loading-mask {
		position: absolute;
		z-index: 2000;
		margin: 0;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: #e6e1e1;
		opacity: 0.1;
	}
	.mod-loading {
		position:absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-20px, -40px, 0);
		.loading-txt {
			padding-top:10px;
		}
		&.no-txt {
			transform: translate3d(-20px, -20px, 0);
		}
	}
</style>
