<template>
</template>
<script>
// import wx from 'weixin-js-sdk'
export default {
  props: ['type'],
  data () {
    return {}
  },
  created () {
    this.config()
  },
  methods: {
    getUserId () {
      return new Promise(resolve => {
        // alert('执行getCurExternalContact')
        window.wx.invoke('getCurExternalContact', {}, (res) => {
          // alert('getCurExternalContact' + res.err_msg)
          if (res.err_msg === 'getCurExternalContact:ok') {
            resolve(res.userId) // 返回当前外部联系人userId
          } else {
            // 错误处理
            // this.$tips('getCurExternalContact' + res.err_msg)
          }
        })
      })
    },
    getChatId () {
      return new Promise(resolve => {
        window.wx.invoke('getCurExternalChat', {}, (res) => {
          if (res.err_msg === 'getCurExternalChat:ok') {
            resolve(res.chatId) // 返回当前客户群的群聊ID
          } else {
            // 错误处理
            // this.$tips('getCurExternalChat' + res.err_msg)
          }
        })
      })
    },
    config () {
      this.$ajax.get('//customer.yunhou.com/api/wechat/get_wxconfig', {typeName: this.type === '1' ? 'qunmap' : 'usermap'}).then((res) => {
        if (res.error !== 0) {
          return
        }
        window.wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端this.$tips出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appId, // 必填，企业微信的corpID
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.noncestr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: [] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        })
        window.wx.ready(() => {
          this.$ajax.get('//customer.yunhou.com/api/wechat/get_wxappconfig', {typeName: this.type === '1' ? 'qunmap' : 'usermap'}).then((res) => {
            if (res.error !== 0) {
              return
            }
            window.wx.agentConfig({
              corpid: res.data.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
              agentid: res.data.agentId, // 必填，企业微信的应用id （e.g. 1000247）
              timestamp: res.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.data.noncestr, // 必填，生成签名的随机串
              signature: res.data.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
              jsApiList: ['getCurExternalContact', 'getCurExternalChat', 'selectExternalContact'], // 必填
              success: (res) => {
                // 回调
                let workArr = []
                if (this.type === 'all') {
                  workArr = [this.getUserId(), this.getChatId()]
                } else if (this.type === '1') {
                  workArr = [this.getChatId()]
                } else {
                  workArr = [this.getUserId()]
                }
                Promise.all(workArr).then((arr) => {
                  this.$emit('complate', arr)
                })
              },
              fail: function (res) {
                // this.$tips(res.errMsg)
                if (res.errMsg.indexOf('function not exist') > -1) {
                  // this.$tips('版本过低请升级')
                }
              }
            })
          })
        })
      })
    }
  }
}
</script>