<template>
  <section class="material-goods">
    <div class="searchBox">
      <i class="iconfontmodsuper icon-search">&#xe83b;</i>
      <input placeholder="请搜索你想要的商品" @input="searchFn" @keyup.enter="searchFn" v-model="form.keywords" type="text"/>
      <i class="iconfontmodsuper icon-clear" v-if="form.keywords!=''" @click="clearFn">&#xe61b;</i>
    </div>
    <div class="mod-list" v-load-more="load" :lm-load="loading" :lm-nomore="noMore && goodsData.length>0">
      <div>
        <div>
          <div class="good-item-block" v-for="(item, index) in goodsData" :key="index">
            <div class="good-img">
              <img :src="(item.goodsImageUrl ? item.goodsImageUrl+'!m2' : 'https://ssl.bbgstatic.com/super/images/common/error-img.png')" />
            </div>
            <div class="good-info">
              <div class="good-name">{{item.productName}}</div>
              <span class="good-label" v-if="item.activityText">{{item.activityText}}</span>
              <span class="good-sales">月销量：{{item.o2oSaleCount || 0}}</span>
              <!-- 价格 -->
              <span class="good-price">
                <em>￥</em><span class="jPrice">{{item.salePrice}}</span>
                <!-- 规格 -->
                <span
                  v-if="item.unit && !item.catchWeightInd"
                  class="specification"
                >/{{item.unit}}</span>
                <!-- 划线价格 -->
                <span
                  v-if="parseFloat(item.salePrice)<parseFloat(item.mktPrice)"
                  class="original-price"
                >￥{{item.mktPrice}}</span>
              </span>
              <div class="share-btn" @click="showPoster(item)">
                <span>分享</span>
                <i class="iconfontmodsuper">&#xe837;</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <mk-page-tips :src="require('@/assets/images/empty.png')" text="暂无数据" v-if="!loading && goodsData.length<1"></mk-page-tips>
    <div>
    </div>
    <!-- 遮罩层 -->
    <mk-pop class="poster-pop" ref="qrcodePop">
      <div slot="ctn" class="qrcode-pop">
        <template v-if="activityCommission>0">
          <div>分享赚钱</div>
          <div>分享此商品给好友，好友用券并核销成功7天后，</div>
          <div class="commission">你就可以返<span> {{activityCommission}} </span>元佣金并可提现</div>
        </template>
        <img :src="qrcodeImage && qrcodeImage.src" />
      </div>
    </mk-pop>
  </section>
</template>
 
<script>
  import Vue from 'vue'
  import pageTips from '@/components/common/page-tips'
  import '@/components/common/load-more'
  Vue.use(pageTips)
  let timer = null
  export default {
    components: {
    },
    data () {
      return {
        form: {
          currentPage: 1,
          pageSize: 20,
          shopIds: localStorage.getItem('__shopId') || '',
          keywords: '',
          marketable: 1,
          sortField: 'o2oSaleCount',
          sortType: 1
        },
        loading: false,
        noMore: false,
        goodsData: [],
        qrcodeImage: '',
        activityCommission: 0 // 佣金
      }
    },
    methods: {
      searchFn () {
        var xreg = /[`~!@#$^&*()=|{}'":;,.<>/?！￥…（）—|【】‘；：“”。，、？%+ \\]/
        if (this.form.keywords && xreg.test(this.form.keywords.toString())) {
          this.$tips('不允许输入特殊字符')
          return false
        }
        if (!this.form.keywords) { return false }
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
          this.load({ isRefresh: true })
        }, 500)
      },
      clearFn () {
        this.form.keywords = ''
        this.load({ isRefresh: true })
      },
      load (obj) {
        if (obj.isRefresh) {
          this.goodsData = []
          this.form.currentPage = 1
          this.noMore = false
        }
        !this.noMore && (this.loading = true)
        this.$ajax.get('//customer.yunhou.com/api/material/searchProducts', this.form).then(rs => {
          if (rs && Number(rs.error) === 0 && rs.data && rs.data.list) {
            let productIds = []
            let list = []
            rs.data.list.forEach((item, index) => {
              list[item.productId] = item
              productIds.push(item.productId)
            })
            this.noMore = rs.data.list.length < 1
            this.form.currentPage++
            if (productIds.length < 1) {
              this.loading = false
              return false
            }
            this.$ajax.get('//customer.yunhou.com/api/material/promotions', {
              productIds: JSON.stringify(productIds),
              shopId: this.form.shopIds
            }).then(rs2 => {
              if (rs2 && Number(rs2.error) === 0 && rs2.data) {
                this.loading = false
                rs2.data.forEach(item => {
                  if (list[item.productId]) {
                    list[item.productId].newSalePrice = item.salePrice
                    list[item.productId].cheep = item.cheep
                    list[item.productId].productDetail = item.productDetail
                    list[item.productId].activityText = item.activityText
                    list[item.productId].mktPrice = item.mktPrice
                    list[item.productId].unit = item.unit
                    list[item.productId].catchWeightInd = item.catchWeightInd
                  }
                })
                this.goodsData = this.goodsData.concat(Object.values(list) || [])
              }
            })
          }
        })
      },
      showPoster (item) {
        let loadingBox = this.$loading('加载中，请稍等...')
        this.activityCommission = item.cheep
        this.$ajax.post('//customer.yunhou.com/api/material/product_share', {
          imgLink: item.goodsImageUrl,
          imgTitle: item.productName,
          actLink: item.productDetail,
          imgPrice: item.salePrice,
          shopId: 90
        }).then(rs => {
          if (rs.error === 0) {
            this.qrcodeImage = new Image()
            this.qrcodeImage.onload = () => {
              loadingBox.hide()
              this.$refs.qrcodePop.show()
            }
            this.qrcodeImage.src = rs.data.img
          } else {
            loadingBox.hide()
            this.$refs.qrcodePop.hide()
          }
        })
      }
    },
    created () {
      this.load(false)
    },
    mounted () {
    }
  }
</script>
 
<style scoped lang="scss">
@import './index.scss';
.mod-list{
  padding: 0;
}
.good-item-block{
  display: flex;
  align-items: center;
  margin-top: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 20px;
  &:first-child{
    margin: 4px;
  }
  .good-img{
    display: block;
    width: 206px;
    height: 206px;
    margin-right: 20px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .good-info{
    flex: 1;
    position: relative;
    padding: 10px 0;
    height: 240px;
    box-sizing: border-box;
    .good-name{
      display: block;
      font-size: 28px;
      color: #333;
      line-height: 34px;
      font-weight: 600;
      display:-webkit-box;
      -webkit-line-clamp:2;
      /*! autoprefixer: off */
      -webkit-box-orient:vertical;
      /* autoprefixer: on */
      overflow:hidden
    }
    .good-label{
      display: inline-block;
      background: rgba(253, 157, 47, .1);
      border-radius: 5px;
      border: solid 1px #f98f1c;
      color: #f98f1c;
      font-size: 18px;
      height: 28px;
      line-height: 28px;
      margin-top: 10px;
      padding: 0 10px;
    }
    .good-sales{
      display: block;
      margin-top: 10px;
      line-height: normal;
      font-size: 24px;
      color: #666666;
    }
    .good-price {
      position: absolute;
      display: block;
      font-size: 28px;
      line-height: 38px;
      color: #f98f1c;
      bottom: 10px;
      .jPrice {
        font-size: 38px;
        font-weight: 600;
      }
      em {
        font-style: normal;
        font-weight: normal;
      }
    }
    .original-price {
      font-size: 22px;
      color: #b5b5b5;
      text-decoration: line-through;
    }
    .specification {
      font-size: 26px;
      color: #b5b5b5;
      float: right;
      margin: 0 0 0 10px;
    }
    .share-btn{
      position: absolute;
      right: 6px;
      bottom: 10px;
      width: 153px;
      height: 60px;
      background-image: linear-gradient(90deg, 
        #2783eb 0%, 
        #64b4ff 100%);
        box-shadow: 0px 5px 12px 1px 
		rgba(92, 171, 248, 0.25);
      border-radius: 30px;
      color: #fff;
      line-height: 1.28rem;
      text-align: center;
      span{
        font-size: 28px;
        font-size: 600;
      }
      i{
        vertical-align: bottom;
        font-size: 32px;
      }
    }
  }
}
.searchBox{
	height: 72px;
	background-color: #ffffff;
	box-shadow: 0px 3px 28px 1px 
		rgba(65, 152, 255, 0.08);
  border-radius: 36px;
  margin: 0 26px 28px;
  display: flex;
  align-items: center;
  color: #999;
  .icon-search{
    margin: 0 10px 0 20px;
    font-size: 36px;
  }
  .icon-clear{
    color: #999;
    font-size: 36px;
    margin: -4px 20px 0 0;
  }
  input{
    font-size: 28px;
    border: none;
    flex: 1;
    margin-right: 10px;
  }
}
.qrcode-pop{
  width: 580px!important;
  height: auto;
  .commission{
    margin-bottom: 30px;
  }
  img{
    width: 100%!important;
    height: auto!important;
  }
  div:nth-of-type(1) {
    font-size:36px;
  }
  div {
    text-align: center;
    color: #fff;
    font-size:26px;
    span {
      font-size:32px;
      color: #eac303;
    }
  }
}

</style>