<template>
  <section :class="['mod-select-shop', showClass]" v-loading="!shopData">
    <!-- 搜索 -->
    <mk-search v-model="searchValue" placeholder="输入门店名称" @change="handleInput" @cancel="onCancel"></mk-search>
    <!-- 当前门店 -->
    <div class="mod-current-shop" >
      <span class="title">当前门店</span>
      <div class="current">
        {{currentShop || '尚未选择门店'}}
      </div>
    </div>
    <!-- 字母搜索 -->
    <mk-letter-search :data="shopData" text="city" ref="search" v-show="searchValue.length === 0">
      <template slot-scope="slotProps">
        <div class="row">
          <div class="shops" v-if="slotProps.row && slotProps.row.length">
            <div v-for="(shop, index) in slotProps.row" :key="index" class="shop-wrap">
              <div class="shop-item">
                <div class="shop" @click="handleClickShop(shop)">{{shop.shopName}}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </mk-letter-search>
    <!-- 搜索结果 -->
    <div class="mod-result" ref="searchResult" v-show="searchValue.length !== 0">
      <div class="result-list">
        <div class="item" v-for="(item, index) in searchResultList" :key="index" @click="handleClickShop(item)">
          <h3 class="txt-overflow">{{item.shopName}}</h3>
          <div class="ctn">
            <span class="address">{{ item.address }}</span>
            <span class="distance">{{ item.disdance }}</span>
          </div>
        </div>
      </div>
      <div class="mod-nomore" v-if="searchResultList && searchResultList.length !== 0"></div>
      <div v-if="searchResultList && searchResultList.length === 0" class="empty">未搜索到相关门店</div>
    </div>
  </section>
</template>

<script>
let timer
import Vue from 'vue'
import Search from '@/components/common/search-1.0.1'
import letterSearch from './letter-search'
import '@/components/common/loading'
import util from '@/assets/js/util.js'
Vue.use(letterSearch)
Vue.use(Search)
export default {
  components: {
    letterSearch
  },
  data () {
    return {
      showClass: '',
      currentShop: localStorage.getItem('__shopName'),
      shopData: '',
      searchValue: '',
      searchResultList: [],
      serviceLine: util.getQueryStringByName('serviceLine') // 业务线001、00101为百货
    }
  },
  methods: {
    onCancel () {
      this.searchValue = ''
    },
    handleClickShop (item) {
      localStorage.setItem('__shopName', item.shopName)
      localStorage.setItem('__shopMdCode', item.shopMdCode)
      localStorage.setItem('__shopId', item.id)
      this.$router.go(-1)
    },
    handleInput () {
      this.searchResultList = []
      timer && clearTimeout(timer)
      timer = setTimeout(_ => {
        let ar = []
        for (let key in this.shopData) {
          ar.push(...this.shopData[key])
        }
        ar = ar.filter(item => {
          return (item.shopName.toString().indexOf(this.searchValue) > -1)
        })
        this.searchResultList = ar
      }, 500)
    }
  },
  mounted () {
    document.title = '选择门店'
    // 获取店铺列表
    this.$ajax.get('//customer.yunhou.com/api/material/getOwnShopIds').then(res => {
      if (res && res.data) {
        this.shopData = res.data
      }
    })
  }
}
</script>

<style scoped lang="scss">
// @import "~compass-mixins/lib/compass/css3";
.mod-select-shop {
  .title {
    display: block;
    padding: 10px 25px;
    color: #999;
    font-size: 26px;
    font-weight: 500;
  }
  .row {
    padding: 30px 30px 0px;
  }
  .city {
    display: block;
    font-size: 28px;
    color: #333;
  }
  .shops {
    padding-bottom: 30px;
    overflow: hidden;
    .shop-wrap {
      width: 31%;
      float: left;
      overflow: hidden;
      text-align: center;
      margin: 15px 15px 0 0;
      .shop-item {
        border: 1px solid #ccc; /*no*/
        border-radius: 8px;
        height: 90px;
      }
    }
    .shop {
      margin-top:14px;
      height: 60px;
      line-height: 30px;
      padding: 0 15px;
      text-align: center;
      font-size: 26px;
      color: #333;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      @include display-box();
      -webkit-line-clamp: 2;
      line-clamp: 2;
      @include box-orient(vertical);
      @include box-pack(center);
      &.active {
        border-color: #fb645f;
        color: #fb645f;
      }
    }
  }
}
// 当前店铺
.mod-current-shop {
  padding-bottom: 30px;
  border-radius: 0px 0px 24px 24px;
  background: #fff;
  .current {
    color: #333;
    padding: 15px 25px;
    font-size: 30px;
    font-weight: 400;
  }
}
// 搜索结果
.mod-result {
  background: #fff;
  border-radius: 24px;
  margin-top:36px;
  overflow:hidden;
  .result-list {
    padding: 0px 30px 0px 40px;
    .item {
      box-sizing:border-box;
      padding: 30px 0px 30px;
      position:relative;
      &:after {
        content: '';
        position:absolute;
        left: 0px;
        right:0px;
        bottom:0px;
        border-bottom:1px solid #ececec;
      }
      h3 {
        display:block;
        font-size:32px;
        line-height: 34px;
        font-weight: 400;
        color: #333;
      }
      .ctn {
        @include display-box();
        span {
          display:block;
          padding-top: 16px;
          font-size:28px;
          line-height: 30px;
        }
        .address {
          @include box-flex(1);
          color: #999;
        }
        .distance {
          color: #333;
        }
      }
    }
  }
  .empty {
    text-align:center;
    font-size:30px;
    padding: 20px;
  }
}
.mod-nomore {
  width:305px;
  height: 22px;
  background: url(img/no-more.jpg) no-repeat;
  background-size: 100%;
  margin: 40px auto;
}
</style>
