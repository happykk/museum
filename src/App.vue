<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script >
// import {weixinShouquan, getQueryString} from '@/components/common/util'
export default {
  name: 'app',
  data () {
    return {
      loading: true
    }
  },
  created () {
    // if (localStorage.getItem('openId')) {
    //   debugger
    //   return
    // }
    // let code = getQueryString('code') // 获取url参数code
    // let state = encodeURIComponent(window.location.href)
    // if (code) { // 拿到code， code传递给后台接口换取opend
    //   this.getUserOpenid(code, state)
    // } else {
    //   weixinShouquan(state)
    // }
  },
  mounted () {
    document.body.addEventListener('focusout', () => {
      let u = navigator.userAgent
      // 软键盘收起的事件处理, 针对ios处理
      if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        window.scrollTo(0, scrollTop)
      }
    })
  },
  methods: {
    getUserOpenid (code, state) {
      this.$ajax.get('//museum.likeghost.club/wechat/code', {
        code: code,
        state: state
      }).then(res => {
        localStorage.setItem('openId', res.data.openid)
      })
    }
  }
}
</script>