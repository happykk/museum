let Vue = {}
if (typeof window !== 'undefined' && window.Vue) {
  Vue = window.Vue
} else {
  Vue = require('vue').default
}

import WaterfallsFlow from './waterfalls-flow.vue'
import touch from './touch'
import lm from './load-more.vue'
import arrow from './arrow.vue'
Vue.component(WaterfallsFlow.name, WaterfallsFlow)

let time = null
let scrollFun = null
let LoadMore = Vue.extend(lm)
let Arrow = Vue.extend(arrow)
let $loadMore = null
let disabled = null
let $arrow = null
let isRefresh = false
let distance = 0
let scrollTo = function (el, top, isMove) {
  let $scroll = el
  if (isMove) {
    $scroll.style['transition'] = ''
    $scroll.style['-webkit-transition'] = ''
  } else {
    $scroll.style['transition'] = '.2s linear'
    $scroll.style['-webkit-transition'] = '.2s linear'
  }
  $scroll.style['transition-timing-function'] = 'linear'
  $scroll.style['-webkit-transition-timing-function'] = 'linear'
  $scroll.style['transform'] = 'translate3d(0px, ' + top + 'px, 0px)'
  $scroll.style['-webkit-transform'] = 'translate3d(0px, ' + top + 'px, 0px)'
}

let loadMore = {
  bind: function (el, binding) {
    // 初始化load-more
    $loadMore = new LoadMore({
      el: document.createElement('div'),
      data: {
        loading: el.getAttribute('lm-load') === 'true',
        noMore: el.getAttribute('lm-nomore') === 'true',
        noMoreText: el.getAttribute('lm-nomore-text')
      }
    })
    el.appendChild($loadMore.$el)

    // 初始化箭头
    if (!binding.modifiers.norefresh) {
      $arrow = new Arrow({
        el: document.createElement('div')
      })
      el.firstElementChild.appendChild($arrow.$el)
    }
  },
  inserted (el, binding) {
    // 初始化 scroll box
    let style = {
      position: 'relative'
      // height: document.documentElement.clientHeight + 'px',
      // 'overflow-y': 'auto',
      // '-webkit-overflow-scrolling': 'touch',
      // 'will-change': 'scroll-position'
    }
    Object.assign(el.style, style)
    el.firstChild.style.position = 'relative'

    // 监听滚动事件
    let load = binding.value
    let body = document.documentElement || document.body
    scrollFun = () => {
      let scrollTop = Number(document.body.scrollTop || document.documentElement.scrollTop)
      let scrollHeight = Number(body.scrollHeight)
      let boxHeight = Number(body.clientHeight)
      if (scrollTop === 0) {
        return false
      }
      if (scrollHeight === (scrollTop + boxHeight) || scrollHeight < (scrollTop + boxHeight)) {
        if (!disabled) {
          isRefresh = false
          load({isRefresh: false})
        }
        return false
      }
    }
    window.addEventListener('scroll', scrollFun)

    // 上拉刷新 -----------------------------------------
    // 初始化上拉箭头
    let norefresh = binding.modifiers.norefresh
    let firstEl = el.firstElementChild
    if (norefresh) {
      return
    }
    // move
    touch(firstEl, {
      arg: 'move',
      value: function (obj) {
        let scrollTop = Number(document.body.scrollTop || document.documentElement.scrollTop)
        // 滚到顶部触发move事件
        if (Number(scrollTop) > 10) { return false }
        $arrow.isLoading = false
        let y = obj.distanceY + distance
        let maxY = 0 // 纵向拖动最大距离
        // 向上滑动
        if (y > 0) {
          document.documentElement.style.overflow = 'hidden'
        }
        maxY = y / 4 > 100 ? 100 : y / 4
        scrollTo(firstEl, maxY, true)
        // if (y > 0 && y < 80) {
        $arrow.isRotate = (y > 50)
        // }
      }
    })
    // end
    touch(firstEl, {
      arg: 'end',
      value: function (obj) {
        document.documentElement.style.overflow = 'inherit'
        let scrollTop = Number(document.body.scrollTop || document.documentElement.scrollTop)
        if (Number(scrollTop) > 10) { return false }
        let y = obj.distanceY
        $arrow.isRotate = false
        if (y > 200) {
          distance = 30
          $arrow.isLoading = true
          // refresh
          isRefresh = true
          load({isRefresh: true})
        } else {
          distance = 0
        }
        scrollTo(firstEl, distance)
      }
    })
  },
  update: function (el, binding) {
    let loading = (el.getAttribute('lm-load') === 'true')
    let noMore = (el.getAttribute('lm-nomore') === 'true')
    disabled = loading || noMore
    // 向下加载
    if (!isRefresh) {
      $loadMore.setOpt({
        loading: loading,
        noMore: noMore
      })
    } else {
      clearTimeout(time)
      time = setTimeout(() => {
        $loadMore.setOpt({
          loading: loading,
          noMore: noMore
        })
        // $loadMore.noMore = false
        // 刷新数据
        $arrow.isLoading = loading
        if (!loading) {
          scrollTo(el.firstElementChild, 0)
          distance = 0
        }
      }, 500)
    }
  },
  unbind: function (el, binding) {
    window.removeEventListener('scroll', scrollFun)
  }
}

//
Vue.directive('load-more', loadMore)
export default loadMore
