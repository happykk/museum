<template>
  <section>
    <div class="header">
      <h3 class="title">分类名称</h3>
      <p>分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍</p>
    </div>
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
  </section>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      lists: []
    }
  },
  methods: {
    goToPage (item) {
      this.$router.push('pro-detail')
    }
  },
  mounted () {
    document.title = '基本陈列'
    this.openId = localStorage.getItem('openId')
  }
}
</script>

<style lang="scss" scoped>
.header{
  background: #872E21;
  color: #fff;
  padding: 16px 24px;
  margin-bottom: 8px;
  .title{
    font-size: 16px;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 2px solid #fff;
  }
  p{
    font-size: 13px;
    color: rgba(255,255,255,0.80);
    line-height: 21px;
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