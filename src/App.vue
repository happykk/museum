<template>
  <div id="app">
    <router-view v-if="!loading"></router-view>
  </div>
</template>
<script >
export default {
  name: 'app',
  data () {
    return {
      loading: true
    }
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
    this.$ajax.get('//customer.yunhou.com/api/qiye_user/login', this.getUrlParams()).then(res => {
      if (res.error === 0) {
      }
    }).then(res => {
      if (localStorage.getItem('__shopId') && localStorage.getItem('__shopName') && localStorage.getItem('__shopMdCode')) {
        this.loading = false
        return
      }
      this.$ajax.get('//customer.yunhou.com/api/user/getOwnShopIds', {upper: false}).then(res => {
        this.loading = false
        if (res && res.data) {
          localStorage.setItem('__shopId', res.data[0].id)
          localStorage.setItem('__shopMdCode', res.data[0].shopMdCode)
          localStorage.setItem('__shopName', res.data[0].shopName)
        }
      })
    })
  },
  methods: {
    getUrlParams () {
      let url = location.search
      let theRequest = {}
      let sessionData = sessionStorage.getItem('__code')
      if (location.href.indexOf('code=') > -1 && url.indexOf('?') !== -1) {
        let str = url.substr(1)
        let strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
        sessionStorage.setItem('__code', JSON.stringify(theRequest))
      } else if (sessionData && sessionData.indexOf('code') > -1) {
        theRequest = JSON.parse(sessionData)
      }
      return theRequest
    }
  }
}
</script>