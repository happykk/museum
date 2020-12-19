<template>
  <div class="poster-container">
    <div class="header" @click="toChangeShop">
      <i class="icon iconfontmodsuper">&#xe7e0;</i>
      <span>当前门店：{{currentShopName}}</span>
    </div>
    <ul class="tab-nav">
      <li v-for="(item, index) in nav" :key="index" :class="{'active': current==index}" @click="setTab(index)">{{item}}</li>
    </ul>
    <div class="mod-list-container">
      <activityList v-if="current===0"></activityList>
      <goodsList v-else></goodsList>
    </div>
  </div>
</template>
<script>
  import activityList from './activity.vue'
  import goodsList from './goods.vue'
  export default {
    components: {
      activityList,
      goodsList
    },
    data () {
      return {
        nav: ['活动', '热销商品'],
        current: 0,
        currentShopName: ''
      }
    },
    methods: {
      setTab (index) {
        this.current = index
      },
      toChangeShop () {
        sessionStorage.setItem('currentTab', this.current)
        this.$router.push('change-shop')
      }
    },
    created () {
      // this.load(false)
    },
    mounted () {
      document.title = '海报'
      if (sessionStorage.getItem('currentTab')) {
        this.current = Number(sessionStorage.getItem('currentTab'))
      }
      if (localStorage.getItem('__shopName')) {
        this.currentShopName = localStorage.getItem('__shopName')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .poster-container{
    min-height: 100vh;
    background: #F7F7F7;
  }
  .header{
    text-align: center;
    background: #4a77b0;
    color: #fff;
    padding: 20px 0 30px;
    i{
      font-size: 30px;
    }
    span{
      font-size: 30px;
    }
  }
  .tab-nav{
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    box-sizing: border-box;
    padding-top: 20px;
    margin-top: -16px;
    display: flex;
    justify-content: center;
    background-image: linear-gradient(0, #F7F7F7 0%,#fff 100%);
    height: 100px;
    li{
      font-size: 32px;
      color: #999999;
      font-size: 600;
      margin-right: 100px;
      &:last-child{
        margin-right: 0;
      }
    }
    .active{
      color: #333;
      &::after{
        content: '';
        width: 28px;
        height: 6px;
        background-image: linear-gradient(90deg, #3a82d8 0%,#64b4ff 100%), 
        linear-gradient( #f96563, #f96563);
        border-radius: 3px;
        display: block;
        margin: 0 auto;
      }
    }
  }
.mod-list-container{
  width: 750px;
  box-sizing: border-box;
}

</style>
