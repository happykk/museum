<template>
  <div class="group-portrait" v-loading="loading">
    <!-- <div class="group-info">
      <div class="group-time line">
        <div class="group-name">
          <img src="@/assets/images/empty.png" alt="">
          <p>金新店一群</p>
        </div>
        <div class="time-box">
          <p>建群时间</p>
          <p>2020-10-13 14:15:55</p>
        </div>
      </div>
      <div class="group-methods">
        <h3 class="title">入群方式</h3>
        <p>成员邀请入群：2人</p>
        <p>扫码入群：28人</p>
      </div>
    </div> -->
    <div class="group-type">
      <h3 class="title line">超市业态</h3>
      <p>B购会员：<span>{{detailObj.member_nums}}人</span></p>
      <p>本周销售额：<span>{{detailObj.week_amt}}</span></p>
      <p>本月销售额：<span>{{detailObj.month_amt}}</span></p>
      <p>今日拉新：<span>{{detailObj.today_new_members}}人</span></p>
      <p>本月拉新：<span>{{detailObj.month_new_members}}人</span></p>
    </div>
    <!-- 企业微信配置 -->
    <config @complate="complate" type="1"></config>
  </div>
</template>
<script>
import config from '@/components/common/config/index.vue'
export default {
  components: {
    config
  },
  data () {
    return {
      ids: [],
      detailObj: {},
      loading: false
    }
  },
  methods: {
    complate (arr) {
      this.ids = arr
      this.getGroup()
    },
    getGroup () {
      this.loading = true
      this.$ajax.get('//customer.yunhou.com/api/qiye_wechat/group_map', {busiType: '002', chatId: this.ids[0] || 'wddffs23'}).then((res) => {
        if (res.error === 0) {
          this.detailObj = res.data
          this.loading = false
        }
      })
    }
  },
  mounted () {
    document.title = '群画像'
    // this.getGroup()
  }
}
</script>
<style lang="scss" scoped>
.group-portrait {
  padding:0 20px;
}
.group-info {
  background: #fff;
  border-radius: 30px;
  padding: 30px;
  .group-time {
    display: flex;
    justify-content: space-between;
    padding: 42px 0 30px 0;
    margin-bottom: 30px;
    .group-name {
      img {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        vertical-align: middle;
      }
      p {
        font-size: 32px;
        color: #333;
        display: inline-block;
        vertical-align: middle;
        font-weight: 500;
      }
    }
    .time-box {
      font-size: 28px;
      color: #666;
      text-align: right;
    }
  }
  .group-methods {
    padding: 0 0 40px 0;
    p {
      font-size: 26px;
    }
  }
}
.title {
  font-size: 32px;
  color: #333;
  font-weight: 700;
}
.group-type {
  margin-top: 24px;
  padding: 30px;
  border-radius: 30px;
  background: #fff;
  .title {
    padding-bottom: 30px;
    margin-bottom: 30px;
  }
  p {
    font-size: 32px;
    font-weight: 500;
    span {
      font-size: 28px;
    }
  }
}
.line {
  position: relative;
  &::before {
    content: '';
    display: block;
    position: absolute;
    height: 1px; /*no*/
    background: #eaeaea;
    left: 0;
    right: 0;
    bottom: 0;
    transform: scaleY(0.5);
  }
}
</style>