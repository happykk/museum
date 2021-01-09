<template>
  <section>
    <div class="header">
      <div class="tab">
        <ul>
          <li :class="current==index?'active':''" v-for="(item, index) in cates" :key="index" @click="changeTab(item, index)">{{item.name}}</li>
        </ul>
      </div>
      <van-search
        v-model="word"
        placeholder="请输入商品名称"
        @search="onLoad"
        @clear="onCancel"
      />
    </div>
    <div class="list">
      <div class="list-item" v-for="item in lists" :key="item.id" @click="goToPage(item)">
        <van-image
          lazy-load
          :src="'http://admin.xiangtanmuseum.com/static/image/'+item.img"
        ></van-image>
        <span>{{item.name}}</span>
      </div>
    </div>
    <mk-page-tips :src="require('@/assets/images/empty.png')" text="暂无数据" v-if="!loading && lists.length<1"></mk-page-tips>
  </section>
</template>

<script>
import Vue from 'vue'
import { Search } from 'vant'
import {getQueryString} from '@/components/common/util'
import pageTips from '@/components/common/page-tips'
Vue.use(pageTips)
Vue.use(Search)
export default {
  data () {
    return {
      loading: true,
      cates: [],
      type: getQueryString('type'),
      word: '',
      id: '',
      current: 0,
      lists: []
    }
  },
  methods: {
    onLoad () {
      console.log(this.word)
      this.$ajax.get('//api.xiangtanmuseum.com/api/ancient/coll_list', {
        word: this.word,
        id: this.id
      }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.lists = res.data || []
        }
      })
    },
    getCateList () {
      this.$ajax.get('//api.xiangtanmuseum.com/api/ancient/cate_list', {type: this.type}).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.cates = res.data || []
          this.id = this.cates[0].id || 0
          this.onLoad()
        }
      })
    },
    changeTab (item, index) {
      this.current = index
      this.id = item.id
      this.onLoad()
    },
    onCancel () {
      this.word = ''
      this.lists = []
      console.log(this.word)
      this.onLoad()
    },
    goToPage (item) {
      this.$router.push({
        path: 'detail',
        query: {
          id: item.id
        }
      })
    }
  },
  mounted () {
    document.title = (this.type === '1') ? '典藏概况' : '文创商品'
    this.getCateList()
  }
}
</script>

<style lang="scss" scoped>
.header{
  position: sticky;
  top: 0;
  width: 100%;
  background: #fff;
  z-index: 999;
  box-shadow: 0 8px 12px 0	rgba(182, 172, 168, 0.15);
  .tab{
    overflow-x: auto;
    ul{
      white-space: nowrap;
      display: inline-block; // 必须设置inline-block，否则无法被li撑开
      margin: 6px 20px 0;
      overflow-x: auto;
      li{
        display: inline-block;
        margin-right: 40px;
        font-size: 14px;
        font-weight: 500;
        line-height: 36px;
        color: rgba(22,22,22,0.60);
        &.active{
          color: #B41700;
        }
      }
    }
  }
}

.list{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .list-item{
    width: 163px;
    height: 196px;
    margin: 16px 0 0 0;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 10px;
    text-align: center;
    .van-image{
      margin: auto;
      /deep/img{
        display: block;
        width: 143px;
        height: 143px;
        object-fit: cover;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
    }
    span{
      font-size: 14px;
      color: #161616;
      display: inline-block;
      margin-top: 10px;
      display: -webkit-box;
      /* autoprefixer: off */
      -webkit-box-orient:vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
}
</style>