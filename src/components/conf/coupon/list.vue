<template>
  <div class="coupon-list" v-loading="loading">
    <div class="tab-head">
      <mk-tabs v-model="tabName" type="line" selected-color="#3d93f0" line-bg-color="#3d93f0" line-type="short" @tab-click="tabChange" selected-class="tab-class">
        <mk-tabs-item name="1" label="用户画像">
          <div class="item"></div>
        </mk-tabs-item>
        <mk-tabs-item name="2" label="优惠券分享">
          <div class="item"></div>
        </mk-tabs-item>
      </mk-tabs>
    </div>
    <div class="head" v-show="tabName==2">
      <div class="shop-title">当前门店</div>
      <div class="shop-name" @click="changeShop">{{selectedShop.shopName}}
        <i class="iconfontmodsuper" >&#xe774;</i>
      </div>
    </div>
    <div class="ul-wrap" v-load-more="loadFn" :lm-load="lmLoading" :lm-nomore="noMore" lm-nomore-text="没有更多数据了~" v-if="tabName==2">
      <ul>
        <li v-for="(item, index) in couList" :key="index" @click="goDetail(item)">
          <div class="list-wrap">
            <div class="select-box" @click.stop v-if="status === 1">
              <mk-checkbox v-model="item.checked" class="radio-box" @update="selectChangeFn(item)" ></mk-checkbox>
            </div>
            <div class="des-box">
              <div class="cou-des">
                <p class="count" :class="{'empty-tips': !item.tips}">
                  <!-- ￥<span>500</span> -->
                  <template v-if="item.type ==2">
                      <span class="price">{{item.price}}</span><span class="discount">折</span>
                  </template>
                  <template v-else-if="item.type ==5">
                      <span>免单券</span>
                  </template>
                  <template v-else-if="item.type ==9">
                      <span>包邮券</span>
                  </template>
                  <template v-else>
                      ￥<span class="price cash-price">{{item.price}}</span>
                  </template>
                </p>
                <p class="tip" v-if="item.tips">{{item.tips}}</p>
              </div>
            </div>
            <div class="cou-box">
              <div class="direction">
                <p class="cou-name" style="-webkit-box-orient: vertical;">
                  {{item.couponName}}
                </p>
                <p class="cou-status statused"><span class="iconfontmodsuper">&#xe7e7;</span>已发布</p>
                <p class="cou-static">
                  <span class="total">总数量: {{item.maxNum}}</span>
                  <span class="num">已领取: {{item.issuedNum || '0'}}</span>
                  <span class="rule" @click.stop="showRule(item)">使用规则<i class="iconfontmod" v-if="!item.isShow">&#xe799;</i><i v-else class="iconfontmod">&#xe796;</i></span>
                </p>
              </div>
            </div>
          </div>
          <div class="rule-wrap" v-html="item.instruction" v-show="item.isShow && item.instruction"></div>
        </li>
      </ul>
      <div class="no-count" v-if="listOptions.pageNo===1&&noMore">
        <img src="~@/assets/images/empty.png" alt="">
      </div>
      <!-- <div class="no-more-class" v-if="listOptions.pageNo!==1&&noMore">没有更多数据了~</div> -->
    </div>
    <div class="bottom-fixed" v-show="tabName==2">
      <div class="btn" @click="changeStatus" v-if="status===0">去分享</div>
      <template v-else>
        <div class="btn cancel-btn" @click="cancelFn">取消</div>
        <div class="btn share-btn" @click="shareFn">立即分享</div>
      </template>
    </div>
    <div class="user-wrap" v-show="tabName==1">
      <div class="group-info" v-if="userObj.userInfo">
        <div class="group-time line" >
          <div class="group-name">
            <img :src="userObj.userInfo.logo" alt="">
            <p>{{userObj.userInfo.name}}</p>
          </div>
          <div class="time-box" v-if="userObj.userInfo.birthdayLeftTime">
            <p>距离生日还有<span>{{userObj.userInfo.birthdayLeftTime}}</span>天<img src="@/assets/images/birthday.png" alt=""></p>
          </div>
        </div>
        <div class="group-methods" v-if="userObj.userInfo">
          <p>注册时间：{{userObj.userInfo.regDate || '-'}}</p>
          <p>性别：{{userObj.userInfo.gender||'-'}}</p>
          <p>年龄：{{userObj.userInfo.age||'-'}}</p>
          <p>生日：{{userObj.userInfo.birthday||'-'}}</p>
          <p>是否黑金卡：{{userObj.userInfo.isVip?'是':'否'}}</p>
          <p>会员等级：{{userObj.userInfo.tier||'-'}}</p>
          <p>是否重点用户：{{userObj.userInfo.isImportant?'是':'否'}}<i class="iconfontmodsuper" @click="showDialog">&#xe627;</i></p>
        </div>
      </div>
      <div class="group-type" v-if="userObj.map">
        <h3 class="title line">消费偏好（超市业态）</h3>
        <p>最近消费：{{userObj.map.recent_consum_time||'-'}}，<span >{{userObj.map.is_thirty_day | day}}</span><i class="iconfontmodsuper icon" @click="goConsume">&#xe7e3;</i></p>
        <!-- <p>收货地址：长沙市</p> -->
        <p>平均消费周期：{{userObj.map.avg_consum_cycle||'-'}}天/次</p>
        <p>客单价：{{userObj.map.customer_price||'-'}}元</p>
        <p>品类偏好：{{userObj.map.category_preference | nameFilter}}</p>
        <p>品牌偏好：{{userObj.map.brand_preference | nameFilter}}</p>
        <template v-if="userObj.map.fre_purchase_items">
          <h3 class="title goods">常购单品：</h3>
          <ul class="goods-ul" v-for="(item, index) in userObj.map.fre_purchase_items" :key="index">
            <li><span>{{item.name}}</span></li>
          </ul>
        </template>
      </div>
    </div>

    <div class="dialog-mask" v-show="isShow" @click="isShow=false">
      <div class="dialog-content" @click.stop>
        <ul>
          <li :class="{'active': item.id===cacheObj.id}" v-for="(item, index) in shopList" :key="index" @click="selectShopFn(item)">
            <span class="shop-list-name">{{item.shopName}}</span>
            <span class="iconfontsuper">&#xe614;</span>
          </li>
        </ul>
        <div class="btn-wrap">
          <div @click="shopConfirm">确定</div>
        </div>
      </div>
    </div>

    <mk-pop ref="rulePop">
      <div slot="ctn">
        <div class="dialog-main">
          <div class="content">
            重点用户：下单未超过4笔的用户或14天内提交过售后申请的用户
          </div>
          <div class="btn" @click="$refs.rulePop.hide()">我知道了</div>
        </div>
      </div>
    </mk-pop>
    <!-- 遮罩层 -->
    <mk-pop class="poster-pop" ref="qrcodePop">
      <div slot="ctn" class="_qrcode-pop">
        <img :src="imgUrl" />
        <span class="icon-close" @click="$refs.qrcodePop.hide()"></span>
        <div class="_qrcode-pop-txt">长按保存图片，发送至微信群或朋友圈</div>
      </div>
    </mk-pop>
    <!-- 企业微信配置 -->
    <config @complate="complate"></config>
  </div>
</template>
<script>
import Vue from 'vue'
import loadmore from '@/components/common/load-more'
import checkbox from '@/components/common/checkbox'
import tabs from '@/components/common/tabs'
import config from '@/components/common/config/index.vue'
Vue.use(checkbox)
Vue.use(tabs)
export default {
  components: {
    loadmore,
    config
  },
  data () {
    return {
      listOptions: {
        pageNo: 1,
        pageSize: 10
      },
      couList: [],
      lmLoading: false,
      noMore: false,
      selectedShop: {
        shopName: localStorage.getItem('__shopName'),
        shopId: localStorage.getItem('__shopId'),
        shopCode: localStorage.getItem('__shopMdCode')
      },
      checkedCouIds: [],
      loading: false,
      status: 0,
      shopList: [],
      isShow: false,
      cacheObj: {},
      memberId: '',
      tabName: '1',
      userObj: {},
      ids: [],
      imgUrl: ''
    }
  },
  created () {
  },
  mounted () {
    this.tabName = sessionStorage.getItem('tabName') || '1'
    document.title = '小助手'
    this.loadFn()
  },
  filters: {
    nameFilter (arr) {
      if (!arr) {
        return
      }
      let newArr = []
      arr && arr.forEach((ele) => {
        newArr.push(ele.name)
      })
      return newArr.toString()
    },
    day (day) {
      if (!day) {
        return ''
      }
      if (day < 90) {
        return `近${day}天未下单`
      } else if (day < 365) {
        return `近${Math.ceil(day / 30)}月未下单`
      } else {
        return `近${Math.ceil(day / 365)}年未下单`
      }
    }
  },
  methods: {
    goConsume () {
      let {posid, member_id, store_id, recent_receipt_number} = this.userObj.map
      this.$router.push({path: '/consume-detail', query: {posId: posid, memberId: member_id, storeId: store_id, billNo: recent_receipt_number}})
    },
    changeShop () {
      this.$router.push({path: '/change-shop'})
    },
    showDialog () {
      this.$refs.rulePop.show()
    },
    getUser () {
      this.$ajax.get('//customer.yunhou.com/api/qiye_wechat/user_map', {
        busiType: '002',
        // memberId: this.ids[0] || '20144586'
        userId: this.ids[0]
      }).then((res) => {
        if (res.error === 0) {
          this.userObj = res.data
        }
      })
    },
    complate (arr) {
      this.ids = arr
      this.getUser()
    },
    tabChange () {
      sessionStorage.setItem('tabName', this.tabName)
      if (this.tabName === '1') {
        this.getUser()
      } else {
        this.resetFn()
      }
    },
    stringFn (str) {
      return str && str.replace(/[\n\r]/g, '<br>')
    },
    showRule (item) {
      this.$set(item, 'isShow', !item.isShow)
    },
    shopConfirm () {
      this.selectedShop = this.cacheObj
      this.isShow = false
      this.resetFn()
    },
    selectShopFn (item) {
      this.cacheObj = item
    },
    showShopPop () {
      // this.isShow = true
    },
    selectedSure () {
      this.selectedShop = this.channelArr[0]
    },
    shareFn () {
      if (!this.checkedCouIds.length) {
        this.$tips('请选择优惠券')
        return
      }
      if (this.checkedCouIds.length > 20) {
        this.$tips('一次最多分享20个优惠券')
        return
      }
      this.loading = true
      this.$ajax.get('//customer.yunhou.com/api/new_share/coupon_share', {couponId: this.checkedCouIds.toString(), shopId: this.selectedShop.shopId}).then((res) => {
        if (res.error === 0) {
          this.imgUrl = res.data
          this.$refs.qrcodePop.show()
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    cancelFn () {
      this.checkedCouIds = []
      this.status = 0
      this.couList.forEach((item) => {
        item.checked = false
      })
    },
    changeStatus () {
      if (!this.couList.length) {
        return
      }
      this.status = 1
    },
    goDetail (item) {
      if (this.status) {
        return
      }
      this.$router.push({path: '/coupon/detail',
        query: {
          couponId: item.couponId,
          shopId: this.selectedShop.shopId
        }
      })
    },
    selectChangeFn (item) {
      let index = this.checkedCouIds.indexOf(item.couponId)
      this.$nextTick(() => {
        if (item.checked) {
          if (index === -1) {
            this.checkedCouIds.push(item.couponId)
          }
        } else {
          if (index !== -1) {
            this.checkedCouIds.splice(index, 1)
          }
        }
      })
    },
    resetFn () {
      this.listOptions.pageNo = 1
      this.couList = []
      this.noMore = false
      this.loadFn()
    },
    loadFn (obj) {
      if (this.tabName !== '2') {
        return
      }
      if (obj && obj.isRefresh) {
        this.couList = []
        this.listOptions.pageNo = 1
        this.noMore = false
      }
      this.lmLoading = true
      let {pageNo, pageSize} = this.listOptions
      this.$ajax.get('//customer.yunhou.com/api/new_share/list', {
        shopId: this.selectedShop.shopId,
        department: '001',
        pageNo,
        pageSize
      }).then((res) => {
        this.lmLoading = false
        this.loading = false
        if (res.error === 0) {
          if (res.data.list && res.data.list.data && res.data.list.data.length) {
            this.listOptions.pageNo ++
            res.data.list.data.forEach((item) => {
              item.checked = false
              item.instruction = this.stringFn(item.instruction)
            })
            this.couList = this.couList.concat(res.data.list.data)
          } else {
            this.noMore = true
          }
          if (res.data.list && !res.data.list.hasNext) {
            this.noMore = true
          }
        } else if (res.error === -100) {
          this.$tips('您还未登录')
          this.noMore = true
          // setTimeout(() => {
          //   window.location.href = 'wx.yunhou.com/super/passport/login?' + encodeURIComponent(window.location.href)
          // }, 3000)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './list.scss'
</style>