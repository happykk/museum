const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
var Mod = {
  hasClass (el, cls) {
    if (!el || !cls) return false
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
    if (el.classList) {
      return el.classList.contains(cls)
    } else {
      return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
    }
  },
  addClass (el, cls) {
    if (!el) return
    var curClass = el.className
    var classes = (cls || '').split(' ')

    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i]
      if (!clsName) continue

      if (el.classList) {
        el.classList.add(clsName)
      } else {
        if (!this.hasClass(el, clsName)) {
          curClass += ' ' + clsName
        }
      }
    }
    if (!el.classList) {
      el.className = curClass
    }
  },
  removeClass (el, cls) {
    if (!el || !cls) return
    var classes = cls.split(' ')
    var curClass = ' ' + el.className + ' '

    for (var i = 0, j = classes.length; i < j; i++) {
      var clsName = classes[i]
      if (!clsName) continue

      if (el.classList) {
        el.classList.remove(clsName)
      } else {
        if (this.hasClass(el, clsName)) {
          curClass = curClass.replace(' ' + clsName + ' ', ' ')
        }
      }
    }
    if (!el.classList) {
      el.className = trim(curClass)
    }
  },
  removeAllClass (el, cls) {
    if (!el || !cls) return
    for (var i = 0; i < el.length; i++) {
      this.removeClass(el[i], cls)
    }
  }
}
export default Mod
