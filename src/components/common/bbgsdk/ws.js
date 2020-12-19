import EventEmitter from 'events'
import {getJsParam} from '../util'
// var isPro = (process.env.NODE_ENV === 'production')

// 默认参数
var defaultSetting = {
  url: getJsParam('/bbgsdk.js', 'url') || ('wss://apppush.yunhou.com:7777'),
  pushId: getJsParam('/bbgsdk.js', 'pushId'),
  targetPushId: getJsParam('/bbgsdk.js', 'targetPushId'),
  registToken: getJsParam('/bbgsdk.js', 'registToken') || '13720963574c9468e5b54d86441f4c70',
  sendToken: getJsParam('/bbgsdk.js', 'sendToken'),
  data: {},
  reconnectCount: 3, // 重连接次数, 默认3次
  enabaleReconnect: true, // 连接失败后是否启动重连接
  enabaleHeartCheck: true, // 是否启动心跳包展示
  delay: 3000 // 心跳检测时间
}

class Ws extends EventEmitter {
  constructor (opt) {
    super()
    this.opt = {}
    Object.assign(this.opt, defaultSetting, opt)
    this.ws = {} // websocket对象
    this.clientTimer = null // 客户端时间对象
    this.serverTimer = null //  服务端时间对象
    this.reconnectCount = 0 // 重连接次数记录
    this.init()
  }

  init () {
    // 判断是否支持websocket
    if (!('WebSocket' in window) && !('MozWebSocket' in window)) {
      console.log('Browser does not support WebSocket!')
      return false
    }
    this.ws = new WebSocket(this.opt.url)
    this.events()
  }

  // 心跳检测
  heartCheck () {
    clearTimeout(this.clientTimer)
    clearTimeout(this.serverTimer)
    this.clientTimer = setTimeout(() => {
      this.send(JSON.stringify(this.opt.data))
      this.serverTimer = setTimeout(() => {
        this.ws.close()
      }, this.delay)
    }, this.delay)
  }

  // 重连接
  reconnect () {
    if (!this.opt.enabaleReconnect) {
      return false
    }
    if (this.reconnectCount < this.opt.reconnectCount) {
      setTimeout(() => {
        this.reset()
        this.reconnectCount++
      }, 2000)
    }
  }

  // 重置
  reset () {
    this.ws = null
    this.init()
  }

  // 销毁
  destory () {
    this.ws.close()
    this.ws = null
  }

  // 注册
  regist () {
    function S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(10).substring(1)
    }
    let opt = {
      type: 200,
      appToken: this.opt.registToken,
      client: {
        pushId: this.opt.pushId, // 后端接口获得
        deviceId: [S4(), S4(), S4()].join(''),
        ip: '',
        deviceInfo: 'h5'
      }
    }
    this.ws.send(JSON.stringify(opt))
    return this
  }

  // 消息发送
  send (_opt) {
    let opt = {
      type: 202,
      message: {
        pushOffline: true,
        targetPushId: this.opt.targetPushId,
        content: JSON.stringify({
          msgType: 'pushMessage',
          businessData: _opt
        })
      },
      client: {pushId: this.opt.pushId},
      appToken: this.opt.sendToken
    }
    this.ws.send(JSON.stringify(opt))
    return this
  }
  // 事件监听
  events () {
    let ws = this.ws
    ws.onerror = (evt) => {
      this.reconnect()
      this.emit('error')
    }
    ws.onclose = (evt) => {
      this.reconnect()
      this.emit('close')
    }
    ws.onopen = (evt) => {
      this.reconnectCount = 0
      this.regist()
      this.emit('open')
    }
    ws.onmessage = (evt) => {
      this.emit('message', {data: evt.data})
      let data = JSON.parse(evt.data)
      if (data.error.id < 0) {
        this.emit('error')
        return false
      }
      if (data.type === 300) {
        this.emit('ready', {data: data})
        return false
      }
    }
    window.onbeforeunload = () => {
      this.opt.enabaleReconnect = false
      this.ws.close()
    }
  }
}

export default Ws
