<template>
  <section>
    <div class="mod-block">
      <van-image v-if="dataInfo"
        lazy-load
        :src="'http://admin.xiangtanmuseum.com/static/image/'+dataInfo.img"
      ></van-image>
      <h3 class="title">{{dataInfo.act_name}}</h3>
      <ul class="info">
        <li class="view-cell">
          <p>展出日期</p>
          <span v-if="dataInfo.act_start_time">
            {{formatDate(Number(dataInfo.act_start_time), 'yyyy-MM-dd')}}
            至
            {{formatDate(Number(dataInfo.act_end_time), 'yyyy-MM-dd')}}
          </span>
          <span v-else>长期</span>
        </li>
        <li class="view-cell">
          <p>展出时间</p>
          <span>{{dataInfo.range_start_time}}-{{dataInfo.range_end_time}}</span>
        </li>
        <li class="view-cell">
          <p>票价</p>
          <span>免费</span>
        </li>
      </ul>
    </div>
    <div class="mod-block desc">
      <h4 class="title">主题简介</h4>
      <div class="desc-content" v-html="dataInfo.context"></div>
    </div>
    <div class="mod-block desc">
      <h4 class="title">展品列表</h4>
      <div class="content">
        <ul class="pro-list">
          <li v-for="(item,index) in cates" :key="item.id" @click="toDetail(item)">
            <i>{{index+1}}</i>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import {getQueryString, formatDate} from '@/components/common/util'
export default {
  data () {
    return {
      formatDate,
      dataInfo: '',
      lists: [],
      cates: [],
      id: getQueryString('id'),
      time: ''
    }
  },
  methods: {
    getData () {
      this.$ajax.get('//api.xiangtanmuseum.com/api/act/info', {id: this.id}).then(res => {
        if (res.code === 0) {
          this.dataInfo = res.data
        }
      })
    },
    getCateList () {
      this.$ajax.get('//api.xiangtanmuseum.com/api/act/cate_list', {id: this.id}).then(res => {
        if (res.code === 0) {
          this.cates = res.data
        }
      })
    },
    toDetail (item) {
      sessionStorage.setItem('cateInfo', JSON.stringify(item))
      this.$router.push({
        path: 'cate-detail',
        query: {
          id: item.id
        }
      })
    }
  },
  mounted () {
    document.title = '详情'
    this.getData()
    this.getCateList()
  }
}
</script>

<style lang="scss" scoped>
.mod-block{
  background: #fff;
  padding: 16px;
  margin-bottom: 8px;
  .van-image{
    width: 100%;
    height: 145px;
    /deep/img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
      margin-bottom: 15px;
    }
  }
  .title{
    font-size: 16px;
    color: #161616;
    margin-top: 10px;
  }
  .info{
    padding: 10px 15px 0;
    .view-cell{
      display: flex;
      justify-content: space-between;
      line-height: 30px;
      p{
        font-size: 14px;
        color: rgba(22,22,22,0.60);
      }
      span{
        font-size: 14px;
        color: #161616;
      }
    }
  }
}
.desc{
  .title{
    font-size: 14px;
    color: #161616;
    margin: 5px 0 0;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      left: -16px;
      top: 0;
      width: 6px;
      height: 18px;
      background: #B41700;
    }
  }
  .desc-content{
    margin: 10px 15px 0;
    font-size: 13px;
    color: rgba(22,22,22,0.60);
    line-height: 21px;
    /deep/img{
      max-width: 100%;
    }
  }
}
.pro-list{
  margin-top: 20px;
  line-height: normal;
  li{
    position: relative;
    margin: 10px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #F2F2F2;
    padding-bottom: 10px;
    &::after{
      content: '';
      position: absolute;
      right: 0;
      width: 7px;
      height: 10px;
      background: url('~@/assets/images/right@2x.png') no-repeat;
      background-size: 100% 100%;
    }
    i{
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      background: rgba(180,23,0,0.20);
      border-radius: 2px;
      font-style: normal;
      font-size: 10px;
      color: #B41700;
      margin-right: 10px;
    }
    span{
      font-size: 14px;
      flex: 1;
      display: -webkit-box;
      /* autoprefixer: off */
      -webkit-box-orient:vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>