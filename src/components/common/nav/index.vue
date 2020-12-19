<template>
  <div ref="nav">
    <div class="mod-placeholder"></div>
    <div :class="['mod-nav', className,  show ? 'animate-up' : '']">
      <div class="nav-list" ref="list">
				<slot/>
      </div>
    </div>
  </div>
</template>
<script>
import dom from './dom'
export default {
  name: 'mk-nav',
  props: ['options', 'show'],
  model: {
    prop: 'show',
    event: 'update'
  },
  data () {
    return {
      appendToElement: '',
      selectedClass: 'selected',
      className: 'mod-nav-default',
      classStr: '',
      $items: ''
    }
  },
  methods: {
    create () {
      this.appendToElement.length !== 0 && document.querySelector(this.appendToElement).appendChild(this.$refs.nav)
    },
    tab (index) {
      dom.removeAllClass(this.$items, this.selectedClass)
      dom.addClass(this.$items[index], this.selectedClass)
    }
  },
  mounted () {
    Object.assign(this.$data, this.options)
    this.create()
    //
    var items = this.$items = this.$refs.list.getElementsByTagName('a')
    var len = items.length
    var self = this
    for (var i = 0; i < len; i++) {
      items[i]._index = i
      items[i].addEventListener('click', function (e) {
        self.tab(this._index)
        self.$emit('select', {el: this, index: this._index})
      })
    }
  }
}
</script>
<style scoped lang="scss">
.mod-placeholder {
  padding-bottom:120px;
}
.mod-nav {
	position: fixed;
	left: 0px;
	height: 100px;
	bottom: 0;
	padding: 0px;
	width: 100%;
	box-sizing:border-box;
	z-index: 10;
	//display:none;
	transform:translateY(100%);
	transition:.3s ease-in-out;
	.nav-list {
		width: 100%;
		@include display-box();
	}
}

.mod-nav-default {
	background-color: #fff;
	border-top: 1px solid #f0f0f4;
	box-shadow:#eaeaeb 2px -1px 20px;
  color: #bab4b3;
}
/* 动画效果 */
.animate-up {
  //display: block;
  transform:translateY(0%);
}
</style>
