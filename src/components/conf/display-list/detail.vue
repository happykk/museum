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
          <span>长期</span>
        </li>
        <li class="view-cell">
          <p>展出时间</p>
          <span>08:00-17:00</span>
        </li>
        <li class="view-cell">
          <p>票价</p>
          <span>免费</span>
        </li>
      </ul>
    </div>
    <div class="mod-block desc">
      <h4 class="title">主题简介</h4>
      <div class="content" v-html="dataInfo.context"></div>
    </div>
    <div class="mod-block desc">
      <h4 class="title">展品列表</h4>
      <div class="content">
        <ul class="pro-list" @click="toDetail">
          <li>
            <i>1</i>
            <span>条目一</span>
          </li>
          <li>
            <i>2</i>
            <span>条目二</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import {getQueryString} from '@/components/common/util'
export default {
  data () {
    return {
      dataInfo: '',
      lists: [],
      id: getQueryString('id')
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
    toDetail (item) {
      this.$router.push('cate-detail')
    }
  },
  mounted () {
    document.title = '基本陈列'
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.mod-block{
  background: #fff;
  padding: 16px;
  margin-bottom: 8px;
  .van-image{
    /deep/img{
      width: 345px;
      height: 145px;
      object-fit: cover;
      border-radius: 5px;
      margin-bottom: 15px;
    }
  }
  .title{
    font-size: 16px;
    color: #161616;
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
  position: relative;
  &::before{
    content: '';
    position: absolute;
    left: 0;
    top: 22px;
    width: 6px;
    height: 18px;
    background: #B41700;
  }
  .title{
    font-size: 14px;
    color: #161616;
    margin: 5px 0 0;
  }
  .content{
    margin: 10px 15px 0;
    font-size: 13px;
    color: rgba(22,22,22,0.60);
    line-height: 21px;
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
  }
}
</style>