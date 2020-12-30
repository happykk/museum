<template>
</template>
<script>
// import wx from 'weixin-js-sdk'
export default {
  props: ['type'],
  data () {
    return {
      appId: 'wx3a35828c20838384'
    }
  },
  created () {
    var typeinfos = this.judgeOS()
    var openid = localStorage.getItem('openid')
    var webMark = this.getQueryString('state')
    if(!openid && typeinfos=='wx'){ // 如果是微信环境 且获取不到缓存中的openid
      if (webMark =='redirectUrl'){ // 重定向之后的页面
        var code = this.getQueryString('code')
        this.getUserOpenid(code, webMark)
      } else { // 未重定向之前 第一次进入的页面
        var currentUrl = encodeURIComponent(window.location.href)
        // 重定向到微信授权登录页
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appId
            + '&redirect_uri=' + currentUrl 
            + '&response_type=code&scope=snsapi_userinfo&state=redirectUrl&connect_redirect=1#wechat_redirect' 
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3a35828c20838384&redirect_uri=http://admin.xiangtanmuseum.com/auth/index.html&response_type=code&scope=snsapi_userinfo&state=http%3A%2F%2Fadmin.xiangtanmuseum.com%2Fauth%2Findex.html&connect_redirect=1#wechat_redirect
      }
    }
  },
  methods: {
    getQueryString (name) {   
      return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
    },
    getUserOpenid (code, state) {
      this.$ajax.get('//admin.xiangtanmuseum.com/wechat/code', {
        code: code,
        state: state
      }).then(res => {
        localStorage.setItem('openId', res.data.openid)
      })
    },
    // 获取code
    // getCodeApi (state) {
    //   let data={
    //     url:location.href
    //   }
    //   getWXconfig(data).then((res)=>{
    //     let Data = res.data
    //     let appId = Data.appId
    //     // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作
    //       wx.config({
    //         debug: false, // 开启调试模式,开发时可以开启
    //         appId: Data.appId,   // 必填，公众号的唯一标识   由接口返回
    //         timestamp: Data.timestamp, // 必填，生成签名的时间戳 由接口返回
    //         nonceStr: Data.nonceStr,    // 必填，生成签名的随机串 由接口返回
    //         signature: Data.signature,   // 必填，签名 由接口返回
    //         jsApiList: [] // 此处填你所用到的方法
    //     })
    //     let urlNow = encodeURIComponent(window.location.href)
    //     let scope='snsapi_base'    //snsapi_userinfo   //静默授权 用户无感知
    //     let url="http://m.yunbisai.com/wechat/Openid?url="+urlNow
    //     window.location.replace(url)
    //   })    
    // },
    judgeOS () {
      let result = -1
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) { // 判断是哪种设备
        result = "android"
      } else if (isiOS) {
        result = "ios"
      } else {
        result = "win"
      }
      if (u.toLowerCase().match(/MicroMessenger/i) == "micromessenger") { // 判断是否为微信内置浏览器
        result = "wx"
      }
      return result
    }
  }
}
</script>