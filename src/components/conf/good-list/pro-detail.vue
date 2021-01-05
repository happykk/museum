<template>
  <section class="mod-block">
    <h3 class="title">藏品名称</h3>
    <p class="desc">分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍分类文字介绍</p>
    <img :src="require('@/assets/images/list-img.png')" class="img">
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
.mod-block{
  min-height: 100vh;
  padding: 16px 24px;
  background: #fff;
  img{
    max-width: 100%;
    border-radius: 4px;
    margin: 10px 0;
  }
}
.title{
  font-size: 16px;
  color: #161616;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #872E21;
}
.desc{
  font-size: 14px;
  color: #161616;
  line-height: 24px;
}
</style>