<template>
  <div class="department-goods-container">
    <searchBar ref="searchBar"></searchBar>
    <div class="filter" ref="filterBox" :class="[{'noRadius': isShowDialog}, {'fixed-tab': isFixed && !isShowDialog}]">
      <div :class="['tab-item', {'active': isFixed && brandObj.id!=''}]">
        <span @click="showDialog('brand')" :class="[{'unfold': currentTab=='brand'}, {'active': brandObj.name}]">
          {{brandObj.name?brandObj.name:'全部品牌'}}
        </span>
        <i class="iconfontmodsuper">{{currentTab=='brand'&&isShowDialog?'&#xe7d5;':'&#xe7d3;'}}</i>
      </div>
      <div :class="['tab-item', {'active': isFixed && storeObj.id!=''}]">
        <span @click="showDialog('store')" :class="[{'unfold': currentTab=='store'},{'active': storeObj.name}]">
          {{storeObj.name?storeObj.name:'全部门店'}}
        </span>
         <i class="iconfontmodsuper">{{currentTab=='store'&&isShowDialog?'&#xe7d5;':'&#xe7d3;'}}</i>
      </div>
    </div>
    <div class="detail-content">
      <div class="content" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0">
        <div style="overflow:hidden;">
          <div class="product-des-bd product-detail" v-for="(item,index) in list" :key="index">
            <a href="javascript:;" @click="linkToDetail(item)" >
              <div class="img">
                <img v-lazy="item.goodsImageUrl"/>
              </div>
              <div class="inf">
                <!-- 商品名称 -->
                <span v-if="item.catchWeightInd" class="description jDescription">{{item.goodsName + ' 约' | weight(item.weight,item.unit)}}</span>
                <span v-if="!item.catchWeightInd" class="description jDescription">{{item.goodsName}}</span>
                <p class="address">{{item.refShopName?item.refShopName:item.shopName}}</p>
                <!-- 品牌名 -->
                <div class="brand-name" v-if="item.refShopName">
                  <img :src="item.deptImg" alt="">
                  <span class="shop-name">{{item.shopName}}</span>
                </div>
                <!-- 价格 -->
                <span class="price">
                  <em>￥</em><span class="jPrice">{{item.salePrice}}</span>
                  <!-- 划线价格 -->
                  <span
                    v-if="parseFloat(item.salePrice)<parseFloat(item.mktPrice)"
                    class="original-price"
                  >￥{{item.mktPrice}}</span>
                </span>
                <div class="percent" v-if="memberStatus.vipFlag==1 && item.commissionRate>0"><i class="iconfontmodsuper"></i>赚{{ item.commissionRate }}%</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="loading" v-show="loading" ><img :src="require('@/assets/images/loading.gif')">加载中...</div>
      <p class="page-end" v-show="noMore && !empty">
        <i class="split"></i>
        <span class="icon iconfontmodsuper">&#xe7a5;</span>已经到底了~
        <i class="split"></i>
      </p>
      <mk-page-tips :src="require('@/assets/images/empty.png')" text="找不到您要的商品" desc="换个关键词试试？" v-if="empty"></mk-page-tips>
    </div>
    <div class="dialog-class" v-show="isShowDialog" @click="hideDialog" ref="filterPop">
      <div class="dialog-content" @click.stop>
        <div class="list" @touchmove.stop>
          <ul v-if="currentTab=='brand'">
            <li
              :class="{'active':item.id == brandObj.id}"
              v-for="(item,index) in brandList"
              :key="index"
              @click="checkFn(item)">
              {{item.brandName}}
            </li>
          </ul>
          <ul v-else>
            <li
              :class="{'active':item.id == storeObj.id}"
              v-for="(item,index) in shopList"
              :key="index"
              @click="checkFn(item)">
              {{item.shopName}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tabs from '@/components/common/tabs'
import searchBar from './search-bar.vue'
import pageTips from '@/components/common/page-tips'
import Vue from 'vue'
import util from '@/assets/js/util'
Vue.use(tabs)
Vue.use(pageTips)
export default {
  components: { searchBar },
  data () {
    return {
      businessModes: Number(sessionStorage.getItem('isStores')),
      tabs: 'v1',
      sortField: '', // 排序字段 o2oSaleCount 销量 umpPrice_wap价格 commissionRate佣金 ''综合
      sortOrder: '', // 排序规则 1： 升序 0：降序
      priceFlag: '', // true: 降序, false: 升序
      list: [],
      newList: [],
      loading: false,
      noMore: false,
      empty: false,
      keywords: '',
      currentPage: 0,
      isNavigateTo: false,
      isShowDialog: false,
      shopList: [
        {shopName: '全部门店', id: ''}
      ],
      brandList: [
        {brandName: '全部品牌', id: ''}
      ],
      brandObj: {id: '', name: '全部品牌'},
      storeObj: {id: '', name: '全部门店'},
      currentTab: '',
      isFixed: false,
      refShopId: '',
      memberStatus: '',  // 是否为黑金会员
      scrollTop: 0
    }
  },
  filters: {
    weight: function (value, weight, unit) {
      if (weight >= 1000) {
        return value + weight / 1000 + 'kg'
      } else {
        return value + weight + 'g'
      }
    }
  },
  mounted () {
    document.title = '商品列表'
    if (sessionStorage.getItem('keyWords')) {
      this.keywords = sessionStorage.getItem('keyWords')
    }
    if (sessionStorage.getItem('brandList')) {
      sessionStorage.removeItem('brandList')
      sessionStorage.removeItem('shopList')
    }
    this.getMemberStatus()
    // this.getBrand()
    // this.getShopList()
    window.addEventListener('scroll', this.handleScroll, true)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    // getBrand () {
    //   this.$ajax.get('//wx.yunhou.com/super/general_search/getPageBrand').then(res => {
    //     this.brandList = this.brandList.concat(Object.values(res.data.list) || [])
    //   })
    // },
    // getShopList () {
    //   this.$ajax.get('//wx.yunhou.com/super/general_search/getShopList').then(res => {
    //     this.shopList = this.shopList.concat(Object.values(res.data) || [])
    //   })
    // },
    getMemberStatus () {
      this.$ajax.get('//wx.yunhou.com/super/member/is_vip').then(res => {
        if (res.error === 0) {
          this.memberStatus = res.data
        }
      })
    },
    sortPrice () {
      this.priceFlag = !this.priceFlag
      let sortOrder = this.priceFlag ? 1 : 0
      this.noMore = false
      this.currentPage = 0
      this.sortField = 'umpPrice_wap'
      this.sortOrder = sortOrder || 0
      this.list = []
      this.loadMore()
    },
    linkToDetail (item) {
      if (this.isNavigateTo) {
        return false
      }
      if (util.getQueryStringByName('fromH5')) {
        window.location.href = item.productDetail
        return
      }
      wx.miniProgram.navigateTo({
        url: '/pages/web/web?url=' + item.productDetail,
        fail: function (res) {
          wx.miniProgram.navigateTo({
            url: '/pages/web/web?url=' + item.productDetail,
            fail: function (res) {
              window.location.href = item.productDetail
            },
            complete: function (res) {
              self.isNavigateTo = true
            }
          })
        },
        complete: function (res) {
          self.isNavigateTo = true
        }
      })
    },
    loadMore () {
      if (this.noMore) {
        return false
      }
      this.currentPage++
      this.loading = true
      let url = '//wx.yunhou.com/super/general_search/search'
      let params = {
        keywords: this.keywords,
        currentPage: this.currentPage,
        pageSize: 10,
        isHasCommission: 0,
        brandFilter: this.brandObj.id,
        shopIds: this.storeObj.id || this.refShopId,
        facetFields: 1
      }
      this.$ajax.post(url, params).then(res => {
        if (!sessionStorage.getItem('brandList')) {
          let brandArr = res.data.facet && res.data.facet.facetBrand || []
          let shopdArr = res.data.facet && res.data.facet.facetRefShop || []
          sessionStorage.setItem('brandList', JSON.stringify(brandArr))
          sessionStorage.setItem('shopList', JSON.stringify(shopdArr))
          this.brandList = this.brandList.concat(brandArr)
          this.shopList = this.shopList.concat(shopdArr)
        }
        this.list = this.list.concat(res.data.list)
        this.uploadPrice(res.data.list)
        this.loading = false
        if (!this.list.length) {
          this.empty = true
        }
        if (!res.data.hasNext) {
          this.noMore = true
        }
      })
    },
    // 更新价格
    uploadPrice (list) {
      var productIds = []
      for (var key = 0; key < list.length; key++) {
        productIds = productIds.concat(list[key].productId)
      }
      this.$ajax.post(this.$apiUrl.updatePrice, {
        productIds: JSON.stringify(productIds),
        commission: 1,
        serviceLine: '001'
      }).then(res => {
        if (!res.data) return
        if (res.data.list && res.data.list.length === 0) {
          return
        }
        this.newList = res.data.list
        for (let index = 0; index < this.newList.length; index++) {
          for (let key = 0; key < this.list.length; key++) {
            if (this.list[key].productId === this.newList[index].productId) {
              this.list[key].salePrice = this.newList[index].salePrice
              this.list[key].mktPrice = this.newList[index].mktPrice
              this.list[key].unit = this.newList[index].unit
              this.list[key].weight = this.newList[index].weight
              this.list[key].catchWeightInd = this.newList[index].catchWeightInd
              this.list[key].commissionRate = this.newList[index].commissionRate
            }
          }
        }
        for (let index = 0; index < this.list.length; index++) {
          this.$set(this.list, index, this.list[index])
        }
      })
    },
    pageScrollTop () {
      return document.documentElement.scrollTop || document.body.scrollTop
    },
    modalStyle (position, width, height) {
      document.documentElement.style.position = position
      document.documentElement.style.width = width
      document.documentElement.style.height = height
      document.body.style.position = position
      document.body.style.width = width
      document.body.style.height = height
    },
    show () {
      this.scrollTop = this.pageScrollTop() === 0 ? this.scrollTop : this.pageScrollTop()
      this.modalStyle('fixed', '100%', '100%')
      if (document.documentElement) {
        document.documentElement.style.top = -this.scrollTop + 'px'
      } else {
        document.body.style.top = -this.scrollTop + 'px'
      }
    },
    hide () {
      this.modalStyle('static', 'auto', 'auto')
      if (document.documentElement) {
        document.documentElement.style.top = 'auto'
      } else {
        document.body.style.top = 'auto'
      }
      window.scrollTo(0, this.scrollTop)
    },
    showDialog (tab) {
      this.scrollTop = window.scrollY
      this.currentTab = tab
      this.isShowDialog = true
      if (this.isFixed) {
        this.$refs.filterPop.style.top = this.$refs.filterBox.clientHeight + 'px'
      } else {
        this.$refs.filterPop.style.top = this.$refs.searchBar.$el.clientHeight + this.$refs.filterBox.clientHeight - window.scrollY + 'px'
      }
      this.show()
    },
    hideDialog () {
      this.currentTab = ''
      this.isShowDialog = false
      this.hide()
    },
    checkFn (item) {
      if (this.currentTab === 'brand') {
        if (item.id !== this.brandObj.id) {
          this.brandObj = {
            id: item.id,
            name: item.brandName
          }
        } else {
          this.brandObj = ''
        }
      } else {
        if (item.id !== this.storeObj.id) {
          this.storeObj = {
            id: item.id,
            name: item.shopName
          }
        } else {
          this.storeObj = ''
        }
      }
      this.noMore = false
      this.empty = false
      this.currentPage = 0
      this.list = []
      this.hideDialog()
      this.loadMore()
    },
    handleScroll () {
      if (window.scrollY > 50) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    }
  }
}
</script>
<style lang="scss">
  .department-goods-container{
    .mk-page-tips{
      .tips-txt{
        font-size: 32px!important;
        color: #555555!important;
      }
      .tips-desc{
        margin-top: 10px;
        font-size: 26px!important;
        color: #999999!important;
      }
    }
  }
  
</style>
<style scoped lang="scss">
.page-view {
  height: 100%;
}
.detail-content {
  position: relative;
  padding-bottom: 122px;
}
.content {
  // padding-top: 122px;
}
.mod-index {
  color: red;
}
.search-bar {
  padding: 10px 0 24px;
  border-bottom: 1px solid #e5e5e5;
}
.product-des-bd {
  position: relative;
  padding: 20px;
  background-color: #fff;
  border-radius: 20px;
  margin: 20px 24px;
  a {
    @include flexbox(
      (
        display: box
      )
    );
    width: 100%;
  }
  .img {
    position: relative;
    height: 240px;
    width: 240px;
    overflow: hidden;
    // @include flexbox((display:box));
    -webkit-box-align: center;
    .sold-out {
      position: absolute;
      top: 26px;
      left: 26px;
      width: 186px;
      height: 186px;
      background-image: url("~@/assets/images/ic_sold_out.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
    }
  }
  img {
    max-width: 100%;
    margin: 0 auto;
  }
  .count {
    position: absolute;
    right: 20px;
    bottom: 15px;
    width: 100px;
    height: 62px;
    border-radius: 22px;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAABCCAYAAABKIMh8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEQTBERTg0NTIxQjQxMUU4OEUxNUJFMkFCQTJDM0NFQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEQTBERTg0NjIxQjQxMUU4OEUxNUJFMkFCQTJDM0NFQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkRBMERFODQzMjFCNDExRTg4RTE1QkUyQUJBMkMzQ0VBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkRBMERFODQ0MjFCNDExRTg4RTE1QkUyQUJBMkMzQ0VBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+1Z3v7AAACCZJREFUeNrsnVtsFFUYx7/v7Oy2UCCWS2LkEkMgQgJVIob4AjFRfMMoYnwxYoLhBcODJiYkiuGBeMGEB998lCjagBqN0ZiQ+gBojEnFC1CNVG7eKr1KaTtzjt92b2en5zaz7e5sOyc5PWdn9jbfb/7f+b6zc6Y4sedpSHjBGXxvkeQD95rcuI3+bqLZ4GANxkgCSBFhP84kLG+GgaDlOdgEahKK/cIBlmg0HJPB0QFSkl2eyshCAUjuq0CJesPBCEDQsL1Z3JrQgDKpStQKyZsmMGgAguB5LZjNbUHEbYC4kbatpXo79duozVFbeVm5q96Ghn3V29T7EN0+p9gZp23/AbA/AcUvIMQPwMVXfGjwGz48NBYCIRzGp0iAMEIobVJLuD9ZsXXePfT3Weo+Slvaqw0r9ZMLp7iNUVuy62R/gECdhIC/7V+70i3BERpgIk7g4ArHppZqKC2tHfT3ENXt5SMs22xWwCn1qcO/JEgv+Vcvn1NAMinLCohFBIOKyso1k5lPanmdDu40PX64SQb82gIiZNvBy5727lz9BrutfX6VPdT2ch5fWUQwoAAz2WKuZS162S7qP1en5DZZyTziPta+uMu7Y8Va2S4KMM6AWA1gyqohMPfRlztF/Q6Y26UDWlq7vJWrthjU4wwoiltTujLMZrcQmM+ovxTSki+LIZv7NATIpqBIcHQBQLUry2bXkM/tpH5byqSqtBGgTm/5ijUWF2dUD4sYAFQ+iLE2AnMsVYy2LIVc6zG2cFGbAZDRvdnGHF10lqHB/xVqN6YMTBbEjWzpsoN5exmiN3TNc9DgyirjjOfdDSzTVY7KVLmLIl+YyTwH71oP8PgThQcnOkH0XKxHnjM1p5ra92Hs1jb/6pV8HsRDVShyIOEy5qBCigVAiAcTFy7nwSxcWKg7dyUrzM61HFQEBsymHuYQLmNINZuofTBxLiQPRdVPhnt7yFu+cpNjgopRktCwavbMgcx/+mcSci17DGG1cyiN2igNcR61O1JbxyiM7cD5bfMMUZs2WkOXMBozmc3ULkotHassyixZstkxnMYoAUHJpW1NbVxLaJDdapk1MLo1tOQ3G1IL1xQYbLDkO2iL1kzqWZ1auCY4qx1Ug5UY3P5DmvxGyxpyTOvWA+56kry2+3CHh1/T7xweBvj4JEA+Ua0vnGWhE56HbF71szbTUNO5tQUNgRMRjFNO9MhjjTiUBa45jikJhShzQE3qYhqX85jBWJPQ8BNLtEcacTSi8/2CK5quMjQE8NGJRhzKiOSFdCkMyGMOgPm6Mrnto9pedzgXfgZx6GXzxOerR6pfc+BFt4nPuh6I6LPYV2YgdGOOTn69achVE5xeiHDRh+svoaU3P59auIbC+fko9maOb1t68dnUwjWU8bGvjSd/TDgF4QTB9/ksIbVyvGAg6OvrjvICVzii6Nby1wd/kdo5RgmCz8X42FiVPWPCEQa/+W5q6RixwM2R96wnvwWOaolDVSXX9hO1ZxJ39HIeNJwwz8v5meDvv37U2VQHiWmg6NpC5fzNvFATZYATHxSg5BPMDzsT5dDE8NARUF/crmrL/fzVN+FZgNKsaaZYvWKblaqH2ewBQPbUlKmQBl1906BVBvarbwL/Hf/3S4fpgU91QqpBcVtQrPIVOTzs1vRKqdTyGwjfP0rtRUiLYSThPcEf14+GbQf6ZSJVCtKNOTowlQ8RYlQE/gvU708pKBP2ft7f/zxFaKMKVdgAleGoFvXIT+YK5RS2BUEv8GA/9UdTGlVllMaZ/XzgRq/SbtV2BdAsrmKGcE5ooJTqpK8k99ZNfnUv9QdTJpOKGRRDg3uDvn+6FeOJ7WpPq1sTlvGGhz+QAJ0T/sRu6vfM7bmzoIfU8gyBOWeyl8XOTkmoSTVcOisKNQgukX/dTWfO8cSF2XUIl2Fi/Hhw/dpuPtD/2xTb6G2oU89k8SQYKLVgUE4AumnvfJAwdusIet4nkPH2UUh6/+zH4p8VIyNvBf03Liqg6CDZklAhw7HNEvAiALkNQP3zdT7MvgC+v59yoXUEaSdBegBm18WIw3R8p8TNmycJynkFBN+gHFvEVkkDpSUgxnWfocQ0nKCG24z0/PzFiDnM5jqQsXuBsTX0eBVtX1K8vNdLcBLq07ZRMtu/lLNcFkHwqxgf/04MDpyj/nhoPAmD8TWgbOOPUjmyawsriYcAlvqBYbxi5VYITuPRt/TgO4i5srjeMZch9+MKN88NyuGOUKbkOp7Dl+OSobkjmGo4lcrBvnAVEwLFlJRzCxwXpTgHBGH1gEE9KgOqzgIZDoJ6XSRAhNXFDYBkUo2wwOGGaE24nBxehLNIBam0LaM4iIykOucFQwlSjssco0o9KiiBJb8BF+WAIpwGhYvjmqkeWS1cCgpUyxcBIq7Lb5ByhHTsYQUFhmTTNUrTisE05qBlDOKW8YaFIKEFTlIA6e6pxh2Tc12y6TRl4+rWTFEc1ySrYTdmWn/fzG5NFbVxxTZhC5dNxXOAYgqzw5CYApTp5gjNAgcscEytDYyIA8cFkAiFyOFpIK4IoaGJozXQANLB0I3N4KKeKG5N92ZcoQoh9blBNUnKcUy5js3F2WaZY90Mz4vwhW235RWWMSXJ7iyuewNHILFuI+nF+MK2u72KCC4saXfIFY4uDhxAiLhQ4sCJoyJTuDybbl0sLM+NDCYuHJOKhGZqZ7bd9NsVSCwotcLRQdKB0gUVzQbHBmlaoEwXHLAYXFgmVUWTuDXX/Yn8RxOuBhc1GqYZVJVoONN9AHP2nxv9L8AA1lozYW3TVG4AAAAASUVORK5CYII=");
    background-position: center center;
    background-size: 100% 100%;
    .iconfontmod {
      font-size: 35px;
      color: #f85e5b;
    }
  }
  .inf {
    @include flexbox(
      (
        box-flex: 1
      )
    );
    -webkit-box-flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 240px;
    .description {
      line-height: 35px;
      display: block;
      font-size: 30px;
      color: #333;
      margin-left: 10px;
      font-weight: 600;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      /** 对象作为伸缩盒子模型显示 **/
      -webkit-box-orient: vertical;
      /** 设置或检索伸缩盒对象的子元素的排列方式 **/
      -webkit-line-clamp: 2;
      /** 显示的行数 **/
      overflow: hidden;
      /** 隐藏超出的内容 **/
    }
    .address{
      margin: 16px 0 0 10px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: #999999;
    }
    .brand-name {
      font-size: 24px;
      margin: 16px 0 0 10px;
      color: #999999;
      display: flex;
      align-items: center;
      img{
        width: 30px;
        height: 30px;
        vertical-align: sub;
        border-radius: 6px;
        border: solid 1px #f1f1f1;
        vertical-align: initial;
      }
      .shop-name{
        overflow: hidden;
        text-overflow: ellipsis;
        width: 89%;
        white-space: nowrap;
        display: inline-block;
      }
    }
    .price {
      position: absolute;
      display: block;
      color: #333;
      font-size: 36px;
      margin-left: 20px;
      bottom: 0px;
      .jPrice {
        font-weight: 700;
      }
      em {
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
      }
    }
    .original-price {
      margin-bottom: 4px;
      font-size: 20px;
      color: #999;
      text-decoration: line-through;
    }
  }
}
.product-des-bd:last-child {
  border-bottom: none;
}
.percent {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 26px;
  i {
    display: inline-block;
    // vertical-align: middle;
    background: url(~@/assets/images/black-gold/share-arrow.png) no-repeat center;
    background-size: 100%;
    height: 17px;
    width: 17px;
    margin-right: 5px;
  }
  line-height: normal;
  color: #9b3f17;
  padding:2px 14px;
  background: linear-gradient(90deg, #fdf0eb, #f0cebf);
  border-radius: 20px;
}
/* 加载中... */
.loading,
.no-more {
  text-align: center;
  font-size: 28px;
  color: #bcbcbc;
  vertical-align: middle;
  padding: 20px 0;
  img {
    position: absolute;
    width: 32px;
    margin-left: rem(-46);
  }
}
/* page-end */
.split {
  display: inline-block;
  border-top: 1px solid #ccc;
  height: 1px;
  width: 50px;
  position: relative;
  top: rem(-8);
  margin: 0 10px;
}
.page-end {
  .icon {
    font-size: 65px;
    margin-right: 5px;
    position: relative;
    top: 16px;
  }
  padding: 10px 0 30px;
  line-height: 24px;
  font-size: 24px;
  color: #999;
  text-align: center;
}
/* tabs */
.filter{
  position: sticky;
  top: 0px;
  z-index: 999;
  height: 100px;
  background: #fff;
  border-radius: 0px 0px 30px 30px;
  font-size: 32px;
  display: flex;
  justify-content: space-around;
  .tab-item{
    flex: 1;
    width: 50%;
    text-align: center;
    padding: 14px 0 26px;
    margin: 0 30px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfontmodsuper{
      margin-left: 8px;
    }
  }
  span{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    display: inline-block;
    max-width: 280px;
    &.unfold::before{
      content: '';
      width: 18px; 
      height: 18px;
      position: absolute;
      bottom: rem(-10);
      left: 42%;
      border-top: 1px solid #efefef; 
      border-right: 1px solid #efefef; 
      transform: rotate(-45deg);
      background: #fff;
    }
  }
  i{
    font-size: 22px;
    color: #999;
  }
}
.dialog-class{
  position: fixed;
  top: 198px;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  z-index: 2;
  .dialog-content{
    padding: 20px 0 40px;
    border-radius: 0px 0px 30px 30px;
    background: #fff;
    .list{
      max-height: 400px;
      overflow-y: auto;
    }
    ul{
      li{
        font-size: 28px;
        color: #666;
        text-align: center;
        padding-top: 30px;
        line-height: 36px;;
        &.active{
          font-size: 36px;
          color: #ad4216;
        }
      }
    }
  }
}
.chosed {
  width: 155px;
  height: 56px;
  background: #e39f7c;
  border: 1px solid #e39f7c;
  color: #9b3f17;
  border-radius: 28px;
  font-size: 28px;
  padding: 0;
  .iconfontmodsuper {
    color: #9b3f17 !important;
  }
}
.checking {
  height: 80px;
  background: #fff;
  border: 1 solid #ccc;
  border-bottom: none;
  border-radius: 28px 28px 0 0;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  line-height: 54px;
}
.noRadius{
  border-radius: initial;
  border-bottom: 1px solid #efefef;

}
.fixed-tab{
  height: auto;
  padding: 10px 0 30px;
  .tab-item{
    height: 58px;
    box-sizing: border-box;
    line-height: 58px;
    padding: 0;
    color: #333;
    font-size: 28px;
    background-color: #f2f2f2;
    border-radius: 30px;
    border: 1px solid #f2f2f2;
    &.active{
      color: #9b3f17;
      background-color: #FCF5F2;
      border: 1px solid #e39f7c;
      i{
        color: #9b3f17;
      }
    }
  }
}
// .shadow{
//   position: absolute;
//   top: 0;
//   right: 0;
//   background: rgba(0, 0, 0, 0.6);
// }
</style>
