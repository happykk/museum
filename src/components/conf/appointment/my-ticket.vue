<template>
  <section>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="noMore"
        :finished-text="lists.length<1?'':'没有更多了'"
        @load="onLoad"
      >
        <div v-for="(item, index) in lists" 
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
        </div>
      </van-list>
    </van-pull-refresh>
    <mk-page-tips :src="require('@/assets/images/empty.png')" text="暂无数据" v-if="!loading && lists.length<1"></mk-page-tips>
  </section>
</template>

<script>
import Vue from 'vue'
import {weixinShouquan, getQueryString} from '@/components/common/util'
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
        this.$ajax.get('//museum.likeghost.club/users/ticket', this.params).then(res => {
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
      this.onLoad()
    },
    toDetail (item) {
      sessionStorage.setItem('detail', JSON.stringify(item))
      this.$router.push('detail')
    },
    getUserOpenid (code, state) {
      this.$ajax.get('//museum.likeghost.club/wechat/code', {
        code: code,
        state: state
      }).then(res => {
        this.openId = res.data.openid
        localStorage.setItem('openId', res.data.openid)
      })
    }
  },
  mounted () {
    if (this.params.openId) {
      return
    }
    let code = getQueryString('code') // 获取url参数code
    let state = encodeURIComponent(window.location.href)
    if (code) { // 拿到code， code传递给后台接口换取opend
      this.getUserOpenid(code, state)
    } else {
      weixinShouquan(state)
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-item{
    position: relative;
    padding: 20px 40px 20px 24px;
    background: #fff;
    border-radius: 10px;
    margin: 12px 16px 0;
    justify-content: space-between;
    display: flex;
    align-items: center;
    .item-info{
      h3{
        font-size: 18px;
        font-weight: 500;
        color: #161616;
        line-height: 26px;
      }
      .time{
        margin: 10px 0;
      }
      .time, .card-num{
        font-size: 13px;
        color: rgba(22,22,22,0.40);
      }
    }
    .qrcode{
      width: 50px;
    }
    .status{
      position: absolute;
      top: 0;
      right: 0;
      width: 68px;
      height: 22px;
      font-size: 12px;
      line-height: 21px;
      text-align: center;
      border-radius: 0 6px 0 21px;
    }
    .success{
      color: #B41700;
      background: #F0D1CC;
    }
  }
  .fail{
    background: rgba(102,102,102,0.1);
    opacity: 0.7;
  }
</style>