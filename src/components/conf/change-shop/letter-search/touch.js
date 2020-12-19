var Vue = {}
if (typeof window !== 'undefined' && window.Vue) {
  Vue = window.Vue
} else {
  Vue = require('vue').default
}

Vue.directive('touch', {
  bind: function (el, binding) {
    var elem = this
    let time = null
    let startX
    let startY
    let modifiers = binding.modifiers
    let arg = binding.arg
    el.addEventListener('touchstart', function (e) {
      var event = e || window.event
      var changedTouche = event.changedTouches[0]
      startX = changedTouche.pageX
      startY = changedTouche.pageY
      let obj = {
        elem: elem,
        event: event
      }
      if (arg === 'start') {
        binding.value(obj)
      }
      time = setTimeout(() => {
        // 长按
        if (arg === 'longtap') {
          binding.value(obj)
        }
      }, 800)
    })
    el.addEventListener('touchmove', function (e) {
      // e.preventDefault()
      var elem = this
      var event = e || window.event
      var changedTouche = event.changedTouches[0]
      var endX = changedTouche.pageX
      var endY = changedTouche.pageY
      var distanceX = endX - startX
      var distanceY = endY - startY
      // swipe
      if (arg === 'move') {
        binding.value({
          elem: elem,
          event: event,
          distanceX: distanceX,
          distanceY: distanceY
        })
      }
    })
    el.addEventListener('touchend', function (e) {
      var elem = this
      var event = e || window.event
      var changedTouche = event.changedTouches[0]
      var endX = changedTouche.pageX
      var endY = changedTouche.pageY
      // distance for move
      var distanceX = endX - startX
      var distanceY = endY - startY
      var obj = {
        elem: elem,
        event: event,
        distanceX: distanceX,
        distanceY: distanceY
      }
      clearTimeout(time)
      // swipe.end
      if (arg === 'end') {
        binding.value(obj)
      }
      // postion for move
      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (arg === 'swipe' && modifiers.right) {
          binding.value(obj)
        }
      } else if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (arg === 'swipe' && modifiers.left) {
          binding.value(obj)
        }
      } else if (Math.abs(distanceX) < Math.abs(distanceY)) {
        if (arg === 'swipe' && modifiers.up) {
          binding.value(obj)
        }
      } else if (Math.abs(distanceX) < Math.abs(distanceY)) {
        if (arg === 'swipe' && modifiers.down) {
          binding.value(obj)
        }
      }
    })
  },
  update: function (el, binding) {
  },
  unbind: function (el, binding) {
  }
})
export default {}
