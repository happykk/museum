<template>
  <section class="container">
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
      <div class="list-item" v-for="(item, index) in lists" :key="item.id" @click="goToPage(item)">
        <i>{{index+1}}</i>
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
      this.$ajax.get('//api.xiangtanmuseum.com/api/voice/coll_list', {
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
      this.$ajax.get('//api.xiangtanmuseum.com/api/voice/cate_list').then(res => {
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
    document.title = '语音导览'
    this.getCateList()
  }
}
</script>

<style lang="scss" scoped>
.container{
  min-height: 100vh;
  background: #fff;
}
.header{
  position: sticky;
  top: 0;
  width: 100%;
  background: #fff;
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
  border-top: 8px solid #F2F2F2;
  padding: 0 32px;
  line-height: normal;
  .list-item{
    position: relative;
    padding: 15px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #F2F2F2;
    padding-bottom: 10px;
    &::after{
      content: '';
      position: absolute;
      right: 0;
      width: 7px;
      height: 10px;
      background: url('~@/assets/images/right@2x.png') no-repeat;
      background-size: 100% 100%;
    }
    i{
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      background: rgba(180,23,0,0.20);
      border-radius: 2px;
      font-style: normal;
      font-size: 10px;
      color: #B41700;
      margin-right: 10px;
    }
    span{
      flex: 1;
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