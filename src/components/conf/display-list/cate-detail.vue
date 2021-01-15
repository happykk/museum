<template>
  <section>
    <div class="header">
      <h3 class="title">{{cateInfo.name}}</h3>
      <div v-html="cateInfo.context"></div>
    </div>
    <div class="list">
      <div class="list-item" @click="goToPage(item)" v-for="item in lists" :key="item.id">
        <van-image
          lazy-load
          :src="'http://admin.xiangtanmuseum.com/static/image/'+item.img"
        ></van-image>
        <span>{{item.name}}</span>
      </div>
    </div>
  </section>
</template>

<script>
import {getQueryString} from '@/components/common/util'
export default {
  data () {
    return {
      loading: false,
      lists: [],
      cateInfo: '',
      id: getQueryString('id')
    }
  },
  methods: {
    goToPage (item) {
      this.$router.push({
        path: 'pro-detail',
        query: {
          id: item.id
        }
      })
    },
    getData () {
      this.$ajax.get('//api.xiangtanmuseum.com/api/act/coll_list', {id: this.id}).then(res => {
        if (res.code === 0) {
          this.lists = res.data
        }
      })
    }
  },
  mounted () {
    document.title = '分类详情'
    this.cateInfo = JSON.parse(sessionStorage.getItem('cateInfo')) || ''
    this.getData()
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
  div{
    font-size: 13px;
    color: rgba(255,255,255,0.80);
    line-height: 21px;
  }
}
.list{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 16px;
  .list-item{
    width: 163px;
    height: 196px;
    margin: 16px 0 0 0;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 10px;
    text-align: center;
    .van-image{
      /deep/img{
        width: 143px;
        height: 145px;
        object-fit: cover;
        border-radius: 5px;
        display: block;
      }
    }
    span{
      font-size: 14px;
      color: #161616;
      display: inline-block;
      margin-top: 10px;
      display: -webkit-box;
      /* autoprefixer: off */
      -webkit-box-orient:vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
}
</style>