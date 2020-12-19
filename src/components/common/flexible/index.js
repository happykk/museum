// flexible.js
(function (window) {
  var dpr
  var scale
  var match

  var document = window.document

  var navigator = window.navigator

  var docEl = document.documentElement

  var viewport = document.querySelector('meta[name="viewport"]')

  var flexible = document.querySelector('meta[name="flexible"]')
  function resize () {
    var width = docEl.getBoundingClientRect().width
    var rem
    if (width / dpr > 640) {
      width = 640 * dpr
    }
    rem = width / 16
    docEl.style.fontSize = rem + 'px'
    window.rem = rem
  }
  function debounce (fn, wait, immediate, context) {
    var timeout
    return function () {
      var ctx = context || this; var args = arguments
      var later = function () {
        timeout = null
        if (!immediate) fn.apply(ctx, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) fn.apply(ctx, args)
    }
  }
  if (viewport) {
    match = viewport.getAttribute('content').match(/initial-scale=(["']?)([\d.]+)\1?/)
    if (match) {
      scale = parseFloat(match[2])
      dpr = parseInt(1 / scale)
    }
  } else if (flexible) {
    match = flexible.getAttribute('content').match(/initial-dpr=(["']?)([\d.]+)\1?/)
    if (match) {
      dpr = parseFloat(match[2])
      scale = parseFloat((1 / dpr).toFixed(2))
    }
  }
  if (!dpr && !scale) {
    dpr = window.devicePixelRatio
    dpr = (navigator.appVersion.match(/android/gi) || navigator.appVersion.match(/iphone/gi)) ? dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1 : 1
    scale = 1 / dpr
  }
  docEl.setAttribute('data-dpr', dpr)
  if (!viewport) {
    var vp = '<meta name="viewport" content="width=device-width, initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no" />'
    if (docEl.firstElementChild) {
      var tmp = document.createElement('div')
      tmp.innerHTML = vp
      docEl.firstElementChild.appendChild(tmp.firstChild)
    } else {
      document.write(vp)
    }
  }
  window.dpr = dpr
  window.addEventListener('resize', debounce(resize, 50), false)
  window.addEventListener('pageshow', debounce(function (window) {
    window.persisted && resize()
  }, 300), false)
  if (document.readyState === 'complete') {
    document.body.style.fontSize = 12 * dpr + 'px'
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.style.fontSize = 12 * dpr + 'px'
    }, false)
  }
  resize()
}(window))
