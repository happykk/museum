<template>
  <section class="container">
    <div class="list-item" v-for="item in lists" :key="item.id" @click="toDetail(item)">
      <van-image
        lazy-load
        :src="'http://admin.xiangtanmuseum.com/static/image/'+item.img"
      ></van-image>
      <h3 class="name">{{item.act_name}}</h3>
      <p class="desc">{{item.context}}</p>
    </div>
    <mk-page-tips :src="require('@/assets/images/empty.png')" text="暂无数据" v-if="!loading && lists.length<1"></mk-page-tips>
  </section>
</template>

<script>
import Vue from 'vue'
import {getQueryString} from '@/components/common/util'
import pageTips from '@/components/common/page-tips'
Vue.use(pageTips)
export default {
  data () {
    return {
      loading: true,
      lists: [],
      type: getQueryString('type')
    }
  },
  methods: {
    onLoad () {
      this.$ajax.get('//api.xiangtanmuseum.com/api/act/list', {type: this.type}).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.lists = res.data
        }
      })
    },
    toDetail (item) {
      this.$router.push({
        path: 'detail',
        query: {
          id: item.id
        }
      })
    }
  },
  mounted () {
    document.title = (this.type === '1') ? '基本陈列' : '精彩特展'
    this.onLoad()
  }
}
</script>

<style lang="scss" scoped>
.container{
  margin-bottom: 20px;
}
.list-item{
  padding: 10px 10px 12px;
  background: #fff;
  border-radius: 10px;
  margin: 16px 16px 0;
  .van-image{
    width: 324px;
    height: 138px;
    margin-bottom: 5px;
    /deep/img{
      object-fit: cover;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
  }
  h3{
    font-size: 14px;
    font-weight: 500;
    color: #161616;
    margin: 5px 0;
  }
  p{
    font-size: 12px;
    color: rgba(22,22,22,0.40);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
</style>