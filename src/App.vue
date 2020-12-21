<template>
  <div id="app">
    <router-view></router-view>
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
  },
  methods: {
  }
}
</script>