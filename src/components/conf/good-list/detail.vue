<template>
  <section class="mod-block">
    <!-- <van-swipe-item v-for="(image, index) in images" :key="index">
      <img v-lazy="image" />
    </van-swipe-item> -->
    <h3 class="title">{{dataInfo.name}}</h3>
    <p class="desc" v-html="dataInfo.context"></p>
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
      this.$ajax.get('//api.xiangtanmuseum.com/api/ancient/coll', {id: this.id}).then(res => {
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
.mod-block{
  min-height: 100vh;
  padding: 16px 24px;
  background: #fff;
  /deep/img{
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