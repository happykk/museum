<template>
  <section>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="noMore"
        :finished-text="lists.length<1?'':'没有更多了'"
        @load="onLoad"
      >
      <div class="list-item" @click="toDetail">
        <img :src="require('@/assets/images/list-img.png')" class="img">
        <h3 class="name">基本陈列名称</h3>
        <p class="desc">陈列简介陈列简介陈列简介陈列简介陈列简介陈列简介陈列简介陈列简介陈列简介陈列简介陈列</p>
      </div>
        <!-- <div v-for="(item, index) in lists" 
          :key="index" class="list-item" 
          :class="{'fail': item.statusAlias=='已取消'||item.statusAlias=='已过期'}"
          @click="toDetail(item)">
          <div class="item-info">
            <h3 class="name">{{item.name}}</h3>
            <p class="time">{{item.appointment_time}}</p>
            <span class="card-num">{{item.code}}</span>
          </div>
          <img :src="require('@/assets/images/QR@2x.png')" class="qrcode">
          <span :class="['status', {'success':item.statusAlias=='已取票'}]" v-if="item.statusAlias=='已取票'">{{item.statusAlias}}</span>
        </div> -->
      </van-list>
    </van-pull-refresh>
    <mk-page-tips :src="require('@/assets/images/empty.png')" text="暂无数据" v-if="!loading && lists.length<1"></mk-page-tips>
  </section>
</template>

<script>
import Vue from 'vue'
import pageTips from '@/components/common/page-tips'
Vue.use(pageTips)
export default {
  data () {
    return {
      params: {
        page: 1,
        pageSize: 10,
        openId: localStorage.getItem('openId')
      },
      loading: false,
      noMore: false,
      refreshing: false,
      lists: []
    }
  },
  methods: {
    onLoad () {
      setTimeout(() => {
        if (this.refreshing) {
          this.lists = []
          this.refreshing = false
        }
        this.$ajax.get('//admin.xiangtanmuseum.com/users/ticket', this.params).then(res => {
          this.loading = false
          if (res.code === 0) {
            this.lists = this.lists.concat(res.data.lists)
            this.params.page++
            this.noMore = !res.data.hasNext
          }
        })
      }, 800)
    },
    onRefresh () {
      this.noMore = false
      this.loading = true
      this.params.page = 1
      this.onLoad()
    },
    toDetail (item) {
      this.$router.push('detail')
    }
  },
  mounted () {
    document.title = '基本陈列'
    this.openId = localStorage.getItem('openId')
  }
}
</script>

<style lang="scss" scoped>
.list-item{
  padding: 10px 10px 12px;
  background: #fff;
  border-radius: 10px;
  margin: 16px 16px 0;
  .img{
    width: 324px;
    height: 138px;
    object-fit: cover;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    margin-bottom: 5px;
  }
  h3{
    font-size: 14px;
    font-weight: 500;
    color: #161616;
    margin: 5px 0;
  }
  p{
    font-size: 12px;
    color: rgba(22,22,22,0.40);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
</style>