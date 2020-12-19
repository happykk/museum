<template>
  <div class="mod-search-history">
    <div class="history-title">
      <h3 v-show="style[state].clearBtn&&style[state].data">{{style[state].txt}}</h3>
      <span v-show="style[state].clearBtn&&style[state].data" @click="clearLocalHistory" class="clear-history">清空</span>
    </div>
    <ul class="search-box clearfix" @click="goList($event)">
      <li v-for="(item,index) in style[state].data" :key="index" :class="{active : clickTag == item}" :data-bpm="'3.1.1.1.1.'+item" v-if="index < 12">{{item}}</li>
    </ul>
  </div>
</template>
<script>
// import { MessageBox } from 'mint-ui'
let storageL = window.localStorage
let storageS = window.sessionStorage
export default {
  props: ['state', 'searchHistory'],
  data () {
    return {
      style: {
        local: {
          txt: '搜索历史',
          clearBtn: true,
          data: ''
        },
        hot: {
          txt: '热门搜索',
          clearBtn: false,
          data: ''
        }
      },
      clickTag: ''
    }
  },
  mounted () {
    this.clickTag = storageS.getItem('keyWords') ? storageS.getItem('keyWords') : ''
    if (this.state === 'local') { this.getLocalHistory() }// 本地搜索历史
    if (this.state === 'hot') { this.getHotHistory() }// 热门搜索
  },
  methods: {
    getQueryString (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return decodeURI(r[2]); return null
    },
    getLocalHistory: function () {
      let localData = [...new Set(JSON.parse(storageL.getItem('searchHistory')))]
      this.style.local.data = localData
      if (!storageL.getItem('searchHistory')) { this.style.local.clearBtn = false }
    },
    getHotHistory: function () {
      this.$ajax.get('http://localhost:8080/api/hotSearch').then(res => {
        if (res.error === 0) {
          if (res.data.length > 0) {
            this.style.hot.data = res.data
          } else {
            alert('error', res.msg)
          }
        }
      })
    },
    // 新的历史记录排在最前面
    sort (val) {
      let ar = this.style[this.state].data || []
      ar.unshift(val)
      ar = [...new Set(ar)]
      if (ar.length > 12) {
        ar.length = 12
      }
      storageL.setItem('searchHistory', JSON.stringify(ar))
    },
    goList: function (event) {
      if (event.target.nodeName !== 'LI') return
      this.clickTag = event.target.innerText
      storageS.setItem('keyWords', this.clickTag)
      this.sort(this.clickTag)
      this.$router.replace({path: 'goodList', query: {keyWords: this.clickTag, fromH5: true}})
    },
    clearLocalHistory: function () {
      localStorage.removeItem('searchHistory')
      this.style.local.data = ''
      this.$emit('update:searchHistory', [])
    }
  },
  computed: {}
}
</script>
<style scoped lang="scss">
.mod-search-history {
  font-family: noto sans s chinese light;
  margin: 24px 20px 5px;
  .history-title {
    margin: 0 10px;
    line-height: 58px;
    h3 {
      font-size: 36px;
      display: inline-block;
      font-weight: 500;
    }
    .clear-history {
      font-size: 30px;
      float: right;
      color: #ad4216;
    }
  }

  .search-box {
    li {
      list-style: none;
      float: left;
      // max-width: 149px;
      min-width: 60px;
      // height: 44px;
      // line-height: 44px;
      background: #eee;
      font-size: 28px;
      text-align: center;
      padding: 14px 20px;
      border: 1px solid #eee;
      border-radius: 10px;
      margin: 15px 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // &.active {
      //   color: #f96563;
      //   border: 1px solid #f96563;
      // }
    }
  }
}
</style>
