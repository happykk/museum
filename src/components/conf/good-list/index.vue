<template>
  <section>
    <div class="header">
      <div class="tab">
        <ul>
          <li class="active">分类</li>
          <li>分类</li>
          <li>分类</li>
        </ul>
      </div>
      <van-search
        left-icon=""
        right-icon="search"
        v-model="params.keywords"
        placeholder="请输入商品名称"
        @search="onLoad"
        @cancel="onCancel" />
    </div>
    <van-list
      v-model="loading"
      :finished="noMore"
      :finished-text="lists.length<1?'':'没有更多了'"
      @load="onLoad"
    >
      <div class="list">
        <div class="list-item" @click="goToPage">
          <img src="" alt="">
          <span>藏品名称</span>
        </div>
        <div class="list-item">
          <img src="" alt="">
          <span>藏品名称</span>
        </div>
        <div class="list-item">
          <img src="" alt="">
          <span>藏品名称</span>
        </div>
      </div>
    </van-list>
    <mk-page-tips :src="require('@/assets/images/empty.png')" text="暂无数据" v-if="!loading && lists.length<1"></mk-page-tips>
  </section>
</template>

<script>
import Vue from 'vue'
import { Search } from 'vant'
import pageTips from '@/components/common/page-tips'
Vue.use(pageTips)
Vue.use(Search)
export default {
  data () {
    return {
      params: {
        page: 1,
        pageSize: 10,
        keywords: '',
        openId: localStorage.getItem('openId')
      },
      loading: false,
      noMore: false,
      lists: []
    }
  },
  methods: {
    onLoad () {
      this.$ajax.get('//admin.xiangtanmuseum.com/users/ticket', this.params).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.lists = this.lists.concat(res.data.lists)
          this.params.page++
          this.noMore = !res.data.hasNext
        }
      })
    },
    onCancel () {
      this.params.keywords = ''
      this.lists = []
      this.params.page = 1
      this.noMore = false
    },
    toDetail (item) {
      this.$router.push('detail')
    }
  },
  mounted () {
    document.title = '文创商品'
    this.openId = localStorage.getItem('openId')
  }
}
</script>

<style lang="scss" scoped>
.header{
  position: sticky;
  top: 0;
  width: 100%;
  background: #fff;
  .tab{
    overflow: hidden;
    ul{
      // white-space: nowrap;
      // display: inline-block; // 必须设置inline-block，否则无法被li撑开
      // li{
      //   display: inline-block;
      // }
      margin: 6px 20px 0;
      overflow-x: auto;
      display: flex;
      li{
        flex: 1;
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
  .list-item{
    width: 163px;
    height: 196px;
    margin: 16px 0 0 16px;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 10px;
    text-align: center;
    img{
      width: 143px;
      height: 143px;
      object-fit: cover;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      display: block;
      margin: auto;
    }
    span{
      font-size: 14px;
      color: #161616;
      display: inline-block;
      margin-top: 10px;;
    }
  }
}
</style>