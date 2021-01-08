<template>
  <section class="container">
    <div class="top">
      <van-image v-if="dataInfo"
        lazy-load
        :src="'http://admin.xiangtanmuseum.com/static/image/'+dataInfo.img"
      ></van-image>
      
      <div class="audio-box">
        <audio>
          <source :src="'http://admin.xiangtanmuseum.com/static/image/'+dataInfo.voice" type="audio/mp3">
        </audio>
      </div>
    </div>
    <div class="mod-block desc">
      <h4 class="title">{{dataInfo.name}}</h4>
      <div class="desc-content" v-html="dataInfo.context"></div>
    </div>
  </section>
</template>

<script>
import {getQueryString} from '@/components/common/util'
export default {
  data () {
    return {
      dataInfo: '',
      id: getQueryString('id'),
      images: []
    }
  },
  methods: {
    getData () {
      this.$ajax.get('//api.xiangtanmuseum.com/api/voice/coll', {id: this.id}).then(res => {
        if (res.code === 0) {
          this.dataInfo = res.data
        }
      })
    }
  },
  mounted () {
    document.title = '基本陈列'
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.top{
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
</style>