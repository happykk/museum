var touch = function (el, binding) {
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
  }, {passive: true})
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
  }, {passive: true})
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
    if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 50) {
      if (arg === 'swipe' && modifiers.right) {
        binding.value(obj)
      }
    } else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < -50) {
      if (arg === 'swipe' && modifiers.left) {
        binding.value(obj)
      }
    } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY < -50) {
      if (arg === 'swipe' && modifiers.up) {
        binding.value(obj)
      }
    } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 0) {
      if (arg === 'swipe' && modifiers.down) {
        binding.value(obj)
      }
    }
  }, {passive: true})
}
export default touch
