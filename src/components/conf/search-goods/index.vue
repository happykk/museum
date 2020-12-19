<template>
	<div class="contains">
      <searchInput ref="search" @enter="enterSearch" @select="onSelect" @close="close" :options="option">
			<ul slot="list">
				<searchTmp state="local" :searchHistory.sync="searchHistory"></searchTmp>
			</ul>
		</searchInput>
	</div>
</template>

<script>
import Vue from 'vue'
import searchTmp from './search-tmp.vue'
import searchInput from './search-input.vue'
import util from '@/assets/js/util'
let storageL = window.localStorage
let storageS = window.sessionStorage
let wx = window.wx
export default {
  components: {searchTmp, searchInput},
  data () {
    return {
      bus: new Vue(),
      searchHistory: [],
      option: {
        autoFocus: false,
        searchInput: storageS.getItem('keyWords') || util.getQueryStringByName('keyWords') || '',
        showAlways: true, // show always.
        title: '搜索你想要的商品', // placeholder value
        url: '//wx.yunhou.com/super/search/autocomplete', // search url,
        delay: 500, // delay time
        showClose: true, // show or hide 'close' button
        listConfig: {
          name: 'keyword' // map 'name' to 'text'
        }
      }
    }
  },
  mounted () {
    document.title = '搜索'
    sessionStorage.setItem('mainShopId', util.getQueryStringByName('mainShopId'))
    if (storageL.getItem('searchHistory')) {
      this.searchHistory = [...new Set(JSON.parse(storageL.getItem('searchHistory')))]
    }
    this.$refs.search.setAutoFocus()
  },
  methods: {
    close: function () {
      if (storageS.getItem('backTo') === 'goodList') {
        this.$router.back(-1)
        return
      } else {
        wx.miniProgram.navigateBack()
      }
    },
    onSelect: function (obj) {
      var xreg = /[`~!@#$^&*()=|{}'":;,.<>/?！￥…（）—|【】‘；：“”。，、？%+ \\]/
      if (obj.searchInput && xreg.test(obj.searchInput)) {
        this.$toast({
          message: '不允许输入特殊字符',
          duration: 1500
        })
        return false
      }

      // 最新搜索历史排在第一, 最多显示12个
      this.searchHistory.unshift(obj.list.keyword)
      this.searchHistory = [...new Set(this.searchHistory)]
      if (this.searchHistory.length > 12) {
        this.searchHistory.length = 12
      }

      storageL.setItem('searchHistory', JSON.stringify(this.searchHistory))
      storageS.setItem('keyWords', obj.list.keyword)
      this.$router.replace({path: 'goodList', query: {keyWords: obj.list.keyword, fromH5: true}})
    },
    enterSearch: function (obj) {
      var xreg = /[`~!@#$^&*()=|{}'":;,.<>/?！￥…（）—|【】‘；：“”。，、？%+ \\]/
      if (obj.searchInput && xreg.test(obj.searchInput.toString())) {
        this.$toast({
          message: '不允许输入特殊字符',
          position: 'top',
          duration: 1500
        })
        return false
      }
      if (!obj.searchInput) { return false }
      this.searchHistory.unshift(obj.searchInput)
      storageL.setItem('searchHistory', JSON.stringify(this.searchHistory))
      storageS.setItem('keyWords', obj.searchInput)
      this.$router.replace({path: 'goodList', query: {keyWords: obj.searchInput}})
    }
  }
}
</script>

<style lang="scss">
.mint-toast,.is-placetop{
	top:26%!important;
	left:50%!important;
	transform: translate(-50%,-50%)!important;
}
.mod-search-pop {
	.mod-search{
		background-color: #fff;
		box-shadow: 0 0 14px 0 #fff!important;
		padding-top:24px!important;
		padding-bottom:24px!important;
		.inner{
			background: #eee!important;
		}
		.icon-close{
			color:#666;
		}
	}
}
.mod-search-pop{
	.mod-box{
		top:122px!important;
	}
}
.mod-search-list{
	top:122px!important;
}
</style>
