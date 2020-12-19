<template>
  <section class="">
    <div class="mod-list" v-load-more="load" :lm-load="loading" :lm-nomore="noMore && lists.length>0">
      <div>
        <div style="overflow: hidden;">
          <div class="item" v-for="item in lists" @click="showPoster(item)" :key="item.id">
            <div class="img-wrap">
              <img :src="(item.poster_img ? item.poster_img : 'https://ssl.bbgstatic.com/super/images/common/error-img.png')"/>
            </div>
            <h3>{{ item.title }}</h3>
            <span>结束时间: {{item.end_time.split(':')[0]}}:{{item.end_time.split(':')[1]}}</span>
          </div>
        </div>
      </div>
    </div>
    <mk-page-tips :src="require('@/assets/images/empty.png')" text="暂无数据" v-if="!loading && lists.length<1"></mk-page-tips>
    <!-- 遮罩层 -->
    <mk-pop class="poster-pop" ref="qrcodePop">
      <div slot="ctn" class="qrcode-pop">
        <img :src="qrcodeImage.src" />
        <span class="icon-close" @click="$refs.qrcodePop.hide()"></span>
        <div class="qrcode-pop-txt">长按保存图片，发送至微信群或朋友圈</div>
      </div>
    </mk-pop>
  </section>
</template>
 
<script>
  import Vue from 'vue'
  import pageTips from '@/components/common/page-tips'
  import '@/components/common/load-more'
  // import '@/components/common/loading'
  Vue.use(pageTips)
  export default {
    components: {
    },
    data () {
      return {
        form: {
          page: 1,
          pageSize: 20,
          shopId: localStorage.getItem('__shopId') || '',
          shopMdCode: localStorage.getItem('__shopMdCode') || ''
        },
        loading: false,
        noMore: false,
        lists: [],
        qrcodeImage: ''
      }
    },
    methods: {
      load (obj) {
        if (obj.isRefresh) {
          this.lists = []
          this.form.page = 1
          this.noMore = false
        }
        !this.noMore && (this.loading = true)
        // 列表
        this.$ajax.get('//customer.yunhou.com/api/material/act_lists', this.form).then(rs => {
          this.loading = false
          if (rs && Number(rs.error) === 0 && rs.data && rs.data.lists) {
            this.lists = this.lists.concat(rs.data.lists || [])
            this.noMore = !rs.data.hasNext
            this.form.page++
          }
        })
      },
      showPoster (item) {
        let loadingBox = this.$loading('加载中，请稍等...')
        this.$ajax.post('//customer.yunhou.com/api/material/normal_share', {
          imgLink: item.poster_img,
          imgTitle: item.title,
          actLink: `https://wx.yunhou.com/super/${item.url}`,
          shopId: 90
        }).then(rs => {
          if (rs.error === 0) {
            this.qrcodeImage = new Image()
            this.qrcodeImage.onload = () => {
              loadingBox.hide()
              this.$refs.qrcodePop.show()
            }
            this.qrcodeImage.src = rs.data.img
          } else {
            loadingBox.hide()
            this.$refs.qrcodePop.hide()
          }
        })
      }
    },
    created () {
      this.load(false)
    },
    mounted () {
      document.title = '海报'
    }
  }
</script>
 
<style scoped lang="scss">
@import './index.scss';
 
</style>