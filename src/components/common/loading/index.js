var Vue = {}
if (typeof window !== 'undefined' && window.Vue) {
  Vue = window.Vue
} else {
  Vue = require('vue').default
}

import { setStyle } from './common/dom'
import loadingVue from './loading.vue'
var Loading = Vue.extend(loadingVue)

const insertDom = (el, binding, isAppend) => {
  setStyle(el, 'position', 'relative')
  setStyle(el, 'overflow', 'hidden')
  if (el.tagName.toLowerCase() === 'button') {
    el.setAttribute('disabled', true)
  }
  if (isAppend) {
    el.appendChild(el.lad)
  } else {
    el.instance.show()
  }
}

//
Vue.directive('loading', {
  bind: function (el, binding) {
    const lad = new Loading({
      el: document.createElement('div'),
      data: {
        text: el.getAttribute('loading-text') || '',
        visible: binding.value
      }
    })
    el.instance = lad
    el.lad = lad.$el
    insertDom(el, binding, true)
  },

  update: function (el, binding) {
    if (!binding.value) {
      el.instance.hide()
      setStyle(el, 'overflow', '')

      if (el.tagName.toLowerCase() === 'button') {
        el.removeAttribute('disabled')
      }
    } else {
      insertDom(el, binding, false)
    }
  },

  unbind: function (el, binding) {
    el.lad && el.lad.parentNode && el.lad.parentNode.removeChild(el.lad)
  }
})
export default {}
