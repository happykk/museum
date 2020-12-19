import './animate.scss'
import Pop from './pop.vue'
import FullScreen from './full-screen.vue'
import Bottom from './bottom.vue'
import Left from './left.vue'
import Loading from './loading.vue'
import Tips from './tips.vue'

let Dialog = {}
Dialog.install = function (Vue, options) {
  var opt = {}
  for (var key in options) {
    opt[key] = options[key]
  }
  //
  var v = Vue.prototype
  var dialog = {}
  //
  var box = function (component, opt) {
    var Controller = Vue.extend(component)
    var instance = new Controller().$mount(document.createElement('div'))
    var isCreate = false
    opt = opt || {}
    if (dialog[opt.id]) {
      instance = dialog[opt.id]
    } else {
      if (opt.id && opt.id.length !== 0) {
        dialog[opt.id] = instance
      }
      Object.assign(instance.$data, opt)
      isCreate = true
    }
    instance.show(isCreate)
    return instance
  }
  // pop ----------------------
  v.$alert = function (ctn, opt) {
    opt = opt || {}
    return box(Pop, Object.assign({
      top: '30%',
      isMaskClose: false,
      type: 'main',
      hideClose: true,
      title: '提示',
      ctn: ctn || '',
      isRemove: !opt.id,
      cancelValue: ''
    }, opt))
  }

  v.$confirm = function (ctn, opt) {
    opt = opt || {}
    return box(Pop, Object.assign({
      top: '30%',
      isMaskClose: false,
      type: 'main',
      isRemove: !opt.id,
      hideClose: true,
      title: '',
      ctn: ctn || ''
    }, opt))
  }

  v.$loading = function (ctn, opt) {
    opt = opt || {}
    return box(Loading, Object.assign({
      isMaskClose: false,
      ctn: ctn || ''
    }, opt))
  }

  // tips ----------------
  v.$tips = function (ctn, opt) {
    opt = opt || {}
    return box(Tips, Object.assign({
      ctn: ctn || ''
    }, opt))
  }

  v.$success = function (ctn, opt) {
    opt = opt || {}
    return box(Tips, Object.assign({
      iconClass: 'success',
      ctn: ctn || ''
    }, opt))
  }

  v.$error = function (ctn, opt) {
    opt = opt || {}
    return box(Tips, Object.assign({
      iconClass: 'error',
      ctn: ctn || ''
    }, opt))
  }

  v.$warn = function (ctn, opt) {
    opt = opt || {}
    return box(Tips, Object.assign({
      iconClass: 'warn',
      ctn: ctn || ''
    }, opt))
  }

  Vue.component(Pop.name, Pop)
  Vue.component(FullScreen.name, FullScreen)
  Vue.component(Bottom.name, Bottom)
  Vue.component(Left.name, Left)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Dialog)
  window.Vue.component(Pop.name, Pop)
  window.Vue.component(FullScreen.name, FullScreen)
  window.Vue.component(Bottom.name, Bottom)
  window.Vue.component(Left.name, Left)
}

export {
  Dialog,
  Pop,
  FullScreen,
  Bottom,
  Left,
  Loading,
  Tips
}
