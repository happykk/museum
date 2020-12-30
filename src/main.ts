import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import { ajax, interceptors } from '@/components/common/ajax'
import router from './router'
import store from './store'
import '@/components/common/reset/index.scss'
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)
import { Toast } from 'vant'
Vue.use(Toast)
// 解决移动端点击延迟问题
import FastClick from 'fastclick'
const str = navigator.userAgent.toLowerCase()
const ver = str.match(/cpu iphone os (.*?) like mac os/)
if (!ver) {
  // 非IOS系统
  FastClick.attach(document.body)
} else {
  if (parseInt(ver[1]) < 11) {
    // 引入fastclick 做相关处理
    FastClick.attach(document.body)
  }
}

Vue.prototype.$ajax = ajax
var error = Toast
var isPro = (process.env.NODE_ENV === 'production')
!isPro && (Vue.prototype.$ajax.jsonp = Vue.prototype.$ajax.post)

interceptors.request.use(config => {
  config.headers = {}
  if (config.method === 'post') {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return config
}, error => {
  return Promise.resolve(false)
})

interceptors.response.use(
  response => {
    // 避免取对象报错
    if (!response.data.data) {
      response.data.data = false
    }
    if ((!response.data || response.data.code === undefined) && response.data.indexOf('DOCTYPE html') < 0) {
      error('接口格式错误')
      return Promise.resolve(false)
    } else if (response.data) {
      if (response.data.code === -100) {
        error('未登录')
        return Promise.resolve(false)
      } else if (Number(response.data.code) !== 0) {
        if (response.data.msg && response.data.msg.length !== 0) {
          error(response.data.msg)
        } else {
          error('接口异常')
        }
        return Promise.resolve(false)
      }
    }
    return Promise.resolve(response)
  },
  err => {
    if (err.message.includes('timeout')) {
      error('请求超时')
    } else {
      error('接口错误')
    }
    Promise.resolve(false)
  }
)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})