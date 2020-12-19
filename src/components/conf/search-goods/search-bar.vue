<template>
  <div :class="['container',isSearchHistory?'container-shadow':'']">
    <div class="mod-search-bar">
      <i class="icon iconfontmodsuper icon-search" @click="inputArea">&#xe7e6;</i>
      <input type="text" :placeholder="hotWord || '搜索您想要的商品'" :autofocus="autofocus" @click="inputArea" readonly="readonly" v-if="hotWord !== undefined"/>
      <input type="text" placeholder="搜索您想要的商品" :autofocus="autofocus" v-model='keyWords' @click="inputArea" readonly="readonly" v-else/>
      <i class="del icon iconfontcom" @click="delKeyWords" v-if="keyWords">&#xe609;</i>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message', 'hotWord'],
  data () {
    return {
      keyWords: '',
      autofocus: false,
      searchCompentShow: false,
      disabled: true,
      isSearchHistory: false,
      shareProducts: this.$route.query.shareProducts || 0,
      isNavigateTo: false
    }
  },

  mounted () {
    if (this.$route.name === '分类') {
      sessionStorage.removeItem('keyWords')
    }
    if (!sessionStorage.getItem('keyWords')) {
      this.keyWords = ''
    } else {
      this.keyWords = sessionStorage.getItem('keyWords')
    }
    if (window.location.search) {
      this.keyWords = unescape(this.getQueryString('keyWords') || '')
      sessionStorage.setItem('keyWords', this.keyWords)
    }
  },
  methods: {
    getQueryString (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return decodeURI(r[2]); return null
    },
    delKeyWords () {
      this.keyWords = ''
      sessionStorage.setItem('keyWords', this.keyWords)
      this.$router.replace({path: 'searchGood', query: {keyWords: this.hotWord}})
    },
    inputArea () {
      sessionStorage.setItem('__hotWords', this.hotWord)
      sessionStorage.setItem('keyWords', this.keyWords)
      if (!this.keyWords) {
        this.keyWords = ''
      }
      this.$router.replace({path: 'searchGood', query: {keyWords: this.hotWord}})
    },
    toMiniprogram (wxUrl) {
      wx.miniProgram.navigateTo({
        url: `/pages/web/web?url=${wxUrl}`,
        fail: function (res) {
          wx.miniProgram.navigateTo({
            url: `/pages/web/web?url=${wxUrl}`,
            fail: function (res) {
              window.location.href = 'https://wx.yunhou.com/super/mall/departmentstore/searchGood'
            },
            complete: function (res) {
              self.isNavigateTo = true
            }
          })
        },
        complete: function (res) {
          self.isNavigateTo = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
    width: 100%;
    z-index: 9;
    padding:24px 34px 0;
    background-color: #fff;
    box-shadow: 0 0 14px 0 #fff;
    box-sizing: border-box;
}
.container-shadow{
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
}
.mod-search-bar{
    background-color: #eee;
    display: block;
    padding: 0 40px 0 0;
    height: 74px;
    border-radius: 37px;
    display: -webkit-box;
    i{
        color:#ccc;
        font-size: 42px;
        margin-left:24px;
        line-height: 72px;
    }
    .del{
      line-height: 36px;
    }
    input{
        background-color: #eee;
        display: block;
        -webkit-box-flex: 1;
        border: none;
        line-height: 74px;
        font-size: 28px;
        color:#333;
        margin-left:10px
    }
    input::-webkit-input-placeholder { /* WebKit browsers */
        color:#ccc;
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color:#ccc;
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color:#ccc;
    }
    input:-ms-input-placeholder { /* Internet Explorer 10+ */
        color:#ccc;
    }
    .del{
        position: absolute;
        display: inline-block;
        right:62px;
        margin-top: 22px;
        width: 32px;
        height: 32px;
        text-align: center;
        border-radius: 50%;
    }
}
</style>
