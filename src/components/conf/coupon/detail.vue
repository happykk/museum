<template>
  <div class="coupon-detail" v-loading="loading">
    <ul class="item-wrap radius">
      <li>
        <div>参与活动商品</div>
        <div class="text-overflow">{{rule.ruleItemList && rule.ruleItemList[0].goodsFilters | goodsFilter}}</div>
      </li>
      <!-- <li>
        <div>商品编码</div>
        <div>{{detailObj.goodsbn?detailObj.goodsbn.length:0}}个商品</div>
      </li> -->
      <li>
        <div>单笔订单金额</div>
        <div class="text-overflow">≥{{rule.ruleItemList && rule.ruleItemList[0].condAmount | amount}}元可用</div>
      </li>
      <li>
        <div>可用渠道</div>
        <div class="text-overflow">{{rule.ruleItemList && rule.ruleItemList[0].channels | filterChannel}}</div>
      </li>
      <li>
        <div>优惠券数量</div>
        <div class="text-overflow">{{detailObj.maxNum}}张</div>
      </li>
      <li>
        <div>每天限量发放</div>
        <div class="text-overflow">{{detailObj.dayMaxNum?detailObj.dayMaxNum:'不限'}}</div>
      </li>
      <li>
        <div>优惠券有效期</div>
        <div>
          <p class="time">{{rule.earliestTime}}</p>
          <p class="time"><span class="gray">至</span> {{rule.latestTime}}</p>
        </div>
      </li>
      <li>
        <div>同一用户限额</div>
        <div class="text-overflow">{{detailObj.userMaxNum}}张</div>
      </li>
    </ul>
    <ul class="item-wrap radius">
      <li>
        <div>优惠券说明:</div>
        <div class="textarea-class" v-html="stringFn(detailObj.info)"></div>
      </li>
    </ul>
    <!-- <ul class="item-wrap radius" v-if="detailObj.isIndexShow || detailObj.isShow">
      <li>
        <div>其他规则</div>
        <div>
          <p class="ru-p" v-if="detailObj.isShow">显示在Better购优惠券中心</p>
          <p class="ru-p" v-if="detailObj.isIndexShow">显示在店铺首页</p>
        </div>
      </li>
    </ul> -->
    <div class="bottom-fixed">
      <div class="btn" @click="shareFn">分享</div>
    </div>
    <!-- 遮罩层 -->
    <mk-pop class="poster-pop" ref="qrcodePop">
      <div slot="ctn" class="_qrcode-pop">
        <img :src="imgUrl" />
        <span class="icon-close" @click="$refs.qrcodePop.hide()"></span>
        <div class="_qrcode-pop-txt">长按保存图片，发送至微信群或朋友圈</div>
      </div>
    </mk-pop>
  </div>
</template>
<script>
// import { Ws } from '@/components/common/bbgsdk'
export default {
  data () {
    return {
      detailObj: {},
      couInfo: this.$route.query,
      rule: {},
      memberId: '',
      imgUrl: '',
      loading: false
    }
  },
  created () {
    // this.$ajax.get('//wx.yunhou.com/super/api/getUser', {}).then((rs) => {
    //   if (rs) {
    //     this.memberId = rs.data.token
    //     // this.ws = new Ws({ pushId: 'tengxunShake_' + rs.data.token, targetPushId: rs.data.token + '', sendToken: '9241bed301cc0a1f8bc9746b85c73f87' })
    //     // this.ws.on('ready', () => {
    //     //   this.share = true
    //     // })
    //   }
    // })
  },
  mounted () {
    document.title = '优惠券详情'
    this.getCouDetail()
  },
  filters: {
    goodsFilter (arr) {
      if (!arr) {
        return
      }
      let str = '部分商品'
      arr.forEach((item) => {
        if (item.type === 0) {
          str = '全部商品'
        }
      })
      return str
    },
    amount (val) {
      return (val / 100).toFixed(2)
    },
    filterChannel (channel) {
      if (!channel) {
        return
      }
      let arr = []
      if (channel.indexOf(3) !== -1) {
        arr.push('better购小程序')
      }
      if (channel.indexOf(8) !== -1) {
        arr.push('线下门店')
      }
      if (channel.indexOf(9) !== -1) {
        arr.push('扫码购')
      }
      if (channel.indexOf(10) !== -1) {
        arr.push('会员码')
      }
      if (arr.length === 4) {
        arr = ['全渠道']
      }
      return arr.toString()
    }
  },
  methods: {
    stringFn (str) {
      return str && str.replace(/[\n\r]/g, '<br>')
    },
    shareFn () {
      // 分享配置
      // let url = 'https://wx.yunhou.com/super/mall/departmentstore/share-coupons?couponIds=' + this.couInfo.couponId + '&memberId=' + this.memberId + '&shopId=' + this.couInfo.shopId
      // this.ws.send({
      //   action: 'share',
      //   data: {
      //     shareImgSrc: 'http://img0.bbgstatic.com/17563a17650_bc_7e3c2f08f751f39cdd627c357019633c_600x480.JPEG',
      //     shareType: 2,
      //     shareUrl: url,
      //     shareTitle: '给您奉上一波优惠券福利'
      //   }
      // })
      this.loading = true
      this.$ajax.get('//customer.yunhou.com/api/new_share/coupon_share', {couponId: this.couInfo.couponId, shopId: this.couInfo.shopId}).then((res) => {
        if (res.error === 0) {
          this.imgUrl = res.data
          this.$refs.qrcodePop.show()
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getCouDetail () {
      let {couponId, shopId} = this.couInfo
      this.$ajax.get('//customer.yunhou.com/api/new_share/get_coupon_datail', {
        couponId,
        shopId
      }).then((res) => {
        this.loading = false
        if (res.error === 0) {
          this.detailObj = res.data && res.data[0]
          this.rule = this.detailObj.ruleList && this.detailObj.ruleList[0]
        }
      })
    }
  }
}
</script>
<style lang="scss">
.coupon-detail {
  overflow: hidden;
  .item-wrap {
    background: #fff;
    margin-top: 20px;
    li {
      padding: 30px 20px 30px 26px;
      display: flex;
      justify-content: space-between;
      position: relative;
      &>div {
        line-height: normal;
        color: #333;
        font-size: 28px;
        .time {
          text-align: right;
          .gray {
            color: #999;
          }
        }
      }
      &>div:first-child {
        color: #999;
      }
      &>div.text-overflow {
        max-width: 460px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &::after {
        content: '';
        display: block;
        height: 1px; /*no*/
        position: absolute;
        background: #ededed;
        left: 25px;
        right: 0;
        bottom: 0;
        transform: scaleY(0.5);
      }
      &>.textarea-class {
        width: 544px;
      }
    }
    li:last-child {
      &::after {
        background: transparent;
      }
    }
  }
  .radius {
    border-radius: 30px;
  }
  .bottom-fixed {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    background: #fff;
    font-weight: 500;
    padding: 10px 0 15px 0;
    box-shadow: 8px 6px 11px rgba(0, 0, 0, 0.2);
    .btn {
      height: 84px;
      width: 664px;
      display: inline-block;
      border-radius: 84px;
      line-height: 84px;
      font-size: 30px;
      color: #fff;
      margin:15px 0;
      background: linear-gradient(to left,  #5badfc, #3d93f0);
    }
  }
}
.poster-pop {
  background-color: rgba(0, 0, 0, 0.6);
  ._qrcode-pop {
    width: 469px;
    height: 700px;
    img {
      width: 469px;
      border-radius: 20px;
      display: block;
    }
    .icon-close{
      width: 50px;
      height: 70px;
      background: url('~@/assets/images/icon-close.png') no-repeat;
      background-size: 100%;
      display: block;
      margin: 0 auto;
    }
    ._qrcode-pop-txt {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0px;
      color: #ffffff;
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>