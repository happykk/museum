<template>
	<div :class="['mod-search-pop', (isShow || showAlways)?'animate-up':'']" ref="pop" :style="{zIndex: getMaxZIndex()}">
		<div class="mod-search">
			<div class="inner" @click="$refs.searchInput.focus()">
				<i class="icon iconfontmodsuper icon-search">&#xe83b;</i>
				<div class="input-box">
          <form action="javascript:void(0);">
            <input type="search" autocomplete="off" ref="searchInput" @input="input" v-model="searchInput" :placeholder="title" @keyup.enter="enter" />
          </form>
				</div>
				<i class="icon iconfontcom icon-empty" v-if="searchInput.length!=0" @click="searchInput='';showList=true">&#xe609;</i>
			</div>
			<div class="icon-close" @click="closePop" v-if="showClose">取消</div>
			<!-- <div class="icon iconfontcom icon-close" @click="closePop">&#xe607;</div> -->
		</div>
		<div class="mod-box"><slot v-if="(isEmpty && searchInput.length==0)||showList" name="list"></slot></div>
		<div class="mod-empty" v-if="isEmpty && searchInput.length!=0">{{ emptyMsg }}</div>
		<ul class="mod-search-list" v-if="list.length!=0 && searchInput.length!=0">
			<li v-for="(item, index) in list" @click="select(item)" :key="index">
				<label class="txt-overflow" v-html="selectText(item[listConfig.name])"></label>
				<!-- <span>文字</span> -->
			</li>
		</ul>
		<!-- <div class="bg"></div> -->
	</div>
</template>
<style scoped lang="scss">
	.mod-empty {
		height:100px;
		line-height:100px;
		color:#a7a7a7;
		font-size:26px;
		padding-left:20px;
	}
	.mod-box {
		position:absolute;
		top:90px;
		bottom:0;
		left:0;
		right:0;
	}
	.mod-search-list {
		overflow: auto;
    position: absolute;
    top: 90px;
    bottom: 0px;
    left: 0px;
    right: 0px;
		li {
			display: flex;
			box-sizing: border-box;
			padding: 0 30px;
			height: 80px;
			line-height: 80px;
			position:relative;
			&:after {
				position:absolute;
				bottom:0px;
				left:30px;
				right:0;
				content:'';
				height:1px;
				border-bottom:1px solid #f2f2f2;
			}
			label, span {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:28px;
			}
			label {
				display:block;
				flex:1;
				text-align:left;
				color:#333;
				padding-right:20px;
			}
			span {
				color:#a7a7a7;
			}
		}
	}
	.mod-search-pop {
		position: fixed;
		left: 0px;
		right: 0px;
		top:0px;
		bottom: 0px;
		padding: 0px;
		width: 100%;
		box-sizing:border-box;
		z-index: 10;
		transform:translateY(rem(-10000000));
		//transition:.3s ease-in-out;
		background:#fff;
		font-size:28px;
		.mod-search {
			padding:10px 30px 0;
		}
	}
	.bg {
	  //box-shadow: 0px 10px 20px #f3f4f4 inset;
		//height:20px;
		border-bottom:1px solid #efefef;
		width:100%;
		position:absolute;
		top:90px;
		left:0px;
		z-index:1;
	}
	.mod-search {
		display: flex;
		font-size:30px;
		.icon-close {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-left:20px;
		}
		.inner {
			flex: 1;
			background:#f2f3f7;
			box-sizing:border-box;
			border-radius:36px;
			display: flex;
			.input-box {
				display:block;
				flex: 1;
				height:70px;
				padding-left:10px;
				input[type="search"] {
          padding:14px 20px 14px 0;
          box-sizing: border-box;
					height:70px;
					// line-height:70px;
          -webkit-user-select: text;
          -moz-user-select: text;
          user-select: text;
          &::placeholder {
            // position: relative;
            // top: rem(-2);
          }
				}
			}
			.icon {
				display:block;
				line-height:30px;
				display: flex;
				justify-content: center;
				align-items: center;
				color:#ccc;
				width:50px;
				text-align:right;
			}
			.icon-empty {
				font-size:40px;
				line-height:36px;
				margin-top:4px;
        padding-right:10px;
			}
			[type="search"] {
				height:30px;
				border:0px;
				background:none;
				width:100%;
			}
			.icon-search {
				font-size:40px;
				padding-left:10px;
			}
		}
	}
	/* 动画效果 */
	.animate-up {
		//display: block;
		transform:translateY(0%);
	}
</style>
<script>
import _ from 'lodash'
var originData = {}
var timer = ''
export default {
  name: 'mk-search',
  props: ['options'],
  data () {
    return {
      autoFocus: false,
      emptyMsg: '',
      showAlways: false,
      isShow: false,
      url: 'https://ssl.yunhou.com/supplier/selectapi/brand_select',
      title: '',
      showList: true,
      isEmpty: false,
      searchInput: '',
      delay: '500',
      ajaxData: {},
      showClose: false,
      appendToElement: '',
      listConfig: {
        name: 'text'
      },
      list: [],
      touched: false
    }
  },
  watch: {
    isShow () {
      var root = document.getElementsByTagName('html')[0]
      root.setAttribute('class', this.isShow ? (_.trim(root.className) + ' _hoh-search') : root.className.replace('_hoh-search', ''))
    }
  },
  methods: {
    enter () {
      this.$emit('enter', {searchInput: this.searchInput})
    },
    selectText (val) {
      var html = val.replace(this.searchInput, '<span style="color:#999;">' + this.searchInput + '</span>')
      return html
    },
    select (item) {
      item.checked = true
      this.$emit('select', {list: item, searchInput: this.searchInput})
      this.isShow = false
    },
    input () {
      var self = this
      this.isEmpty = false
      this.showList = false
      if (this.searchInput.length === 0) {
        this.showList = true
        return
      }
      timer && clearTimeout(timer)
      timer = setTimeout(function () {
        self.$ajax.post(self.url, _.merge({key: self.searchInput}, self.ajaxData)).then(function (rs) {
          if (rs && rs.data && rs.data.list && rs.data.list.length !== 0) {
            self.list = rs.data.list
          } else {
            self.list = []
            self.isEmpty = true
          }
        })
      }, self.delay)
    },
    show () {
      this.touched = false
      this.create()
      this.reset()
      this.isShow = true
      _.merge(this.$data, this.options)
      if (this.searchInput.length !== 0) {
        this.searchData()
      }
      this.autoFocus && this.setFocus()
      this.$emit('show', {searchInput: this.searchInput})
    },
    setFocus () {
      this.$refs.searchInput.focus()
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollHeight
      }, 200)
    },
    setAutoFocus () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.searchInput.focus()
        }, 500)
      })
    },
    searchData (obj) {
      if (!_.isEmpty(obj)) {
        this.searchInput = obj.key
        _.merge(this.ajaxData, obj)
      }
      this.input()
    },
    closePop () {
      this.isShow = false
      this.$emit('close', {searchInput: this.searchInput})
    },
    getMaxZIndex () {
      var max = 11
      var divs = document.getElementsByTagName('div')
      for (var i = 0; i < divs.length; i++) {
        if (divs[i].style.zIndex && divs[i].className.indexOf('mod-search-pop') < 0) {
          if (parseInt(divs[i].style.zIndex) > max) {
            max = parseInt(divs[i].style.zIndex)
          }
        }
      }
      return Number(max) + 1
    },
    create () {
      this.appendToElement.length !== 0 && document.querySelector(this.appendToElement).appendChild(this.$refs.pop)
    },
    reset () {
      Object.assign(this.$data, originData)
    },
    triggerFocusForIos () {
      var self = this
      var agent = navigator.userAgent.toLowerCase()
      if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
        document.body.addEventListener('touchstart', function (event) {
          (self.autoFocus && !self.touched) && self.setFocus()
          self.touched = true
        })
      }
    }
  },
  mounted () {
    originData = _.cloneDeep(this.$data)
    if (this.options.isShow || this.options.showAlways) {
      this.show()
      this.triggerFocusForIos()
    }
  }
}
</script>
