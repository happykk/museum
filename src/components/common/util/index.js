// 是否为空
export function isEmpty (arg) {
  // number
  if ((typeof arg).toLowerCase() === 'number') {
    return arg.toString().length === 0
  }
  // object
  if (Object.prototype.toString.call(arg) === '[object Object]') {
    for (var key in arg) {
      if (arg.hasOwnProperty(key)) {
        return false
      }
    }
  }
  // Array
  if (Object.prototype.toString.call(arg) === '[object Array]' && arg.length !== 0) {
    return false
  }
  // string
  if (typeof arg === 'string' && arg.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') !== '') {
    return false
  }
  return true
}

// 深度克隆
export function deepClone (source) {
  if (!source || typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  var targetObj = source.constructor === Array ? [] : {}
  for (var keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

// 去空格
export function trim (val) {
  return val.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

// 获取地址栏参数
export function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  var context = ''
  if (r != null) { context = r[2] }
  reg = null
  r = null
  return context === null || context === '' || context === 'undefined' ? '' : context
}

// 刷新网页
export function refreshPage () {
  location.replace(replaceUrlParam(location.href, '_r', new Date().getTime()))
}

// 替换地址栏参数
var global = window
export function replaceUrlParam (url, arg, val) {
  var pattern = arg + '=([^&]*)'
  var replaceText = arg + '=' + val
  if (url.match(pattern)) {
    var tmp = '/(' + arg + '=)([^&]*)/gi'
    tmp = url.replace(global.eval(tmp), replaceText)
    return tmp
  } else {
    if (url.match('[?]')) {
      return url + '&' + replaceText
    } else {
      return url + '?' + replaceText
    }
  }
}

// 去抖
export function debounce (fn, delay) {
  var timer = null
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

// 函数节流 (延迟方法执行时间)
export function throttle (fn, m) {
  let ms = m || 150
  if (ms === -1) {
    return function () { fn.apply(this, arguments) }
  }
  var last
  return function () {
    var ctime = ctime + new Date()
    if (!last || ctime - last > ms) {
      last = ctime
      fn.apply(this, arguments)
    }
  }
}

/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 * @example formatDate(new Date(), 'yyyy-MM-dd')
 * @example formatDate(1472793615764, 'yyyy-MM-dd')
 */
export function formatDate (date, fmt) {
  date = date === undefined ? new Date() : date
  date = typeof date === 'number' ? new Date(date) : date
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
  var obj = {
    'y': date.getFullYear(), // 年份，注意必须用getFullYear
    'M': date.getMonth() + 1, // 月份，注意是从0-11
    'd': date.getDate(), // 日期
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'w': date.getDay(), // 星期，注意是0-6
    'H': date.getHours(), // 24小时制
    'h': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    'm': date.getMinutes(), // 分钟
    's': date.getSeconds(), // 秒
    'S': date.getMilliseconds() // 毫秒
  }
  var week = ['天', '一', '二', '三', '四', '五', '六']
  for (var i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
      var val = obj[i] + ''
      if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val]
      for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
      return m.length === 1 ? val : val.substring(val.length - m.length)
    })
  }
  return fmt
}

/**
 * 将字符串解析成日期
 * @param str 输入的日期字符串，如'2014-09-13'
 * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
 * @returns 解析后的Date类型日期
 * @example parseDate('2016-08-11 13:28:43', 'yyyy-MM-dd HH:mm:ss')
 */
export function parseDate (str, fmt) {
  fmt = fmt || 'yyyy-MM-dd'
  var obj = {y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0}
  fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
    str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
      obj[$3] = parseInt(_$1)
      return ''
    })
    return ''
  })
  obj.M-- // 月份是从0开始的，所以要减去1
  var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s)
  if (obj.S !== 0) { date.setMilliseconds(obj.S) } // 如果设置了毫秒
  return date
}

// 安卓
export function isAndroid () {
  var agent = navigator.userAgent.toLowerCase()
  var isAndroid = (agent.match(/android/i) === 'android')
  return isAndroid
}

// isApp
export function isApp () {
  if (window.AndroidJavascriptBridge) {
    return true
  }

  var isIOS = (navigator.userAgent.indexOf('iOSGlobal') > -1)
  if (isIOS) {
    return true
  }

  var clientArg = getQueryString('client')
  if (clientArg === 'app') {
    return true
  }
  return false
}

export function isMobile () {
  return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) || /(Android)/i.test(navigator.userAgent)
}

// is 微信
export function isWeixin () {
  var navigator = window.navigator
  var userAgent = navigator.userAgent
  userAgent = userAgent.toLowerCase()
  return (userAgent.match(/micromessenger/i) === 'micromessenger')
}

// is 小程序
export function isMiniProgram () {
  return (window.__wxjs_environment === 'miniprogram') || (navigator.userAgent.toLowerCase().indexOf('miniprogram') !== -1)
}

export function weixinShouquan (state) {
  let urlNow = encodeURIComponent(window.location.href)
  let scope = 'snsapi_userinfo' // snsapi_userinfo 静默授权 用户无感知
  let appid = 'wx3a35828c20838384'
  let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${urlNow}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
  window.location.replace(url)
}
