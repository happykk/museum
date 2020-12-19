export function generateUUID () {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

export function getZIndex (Vue, selfzIndex, callb) {
  Vue.$nextTick(() => {
    var max = 11
    var divs = document.getElementsByTagName('div')
    for (var i = 0; i < divs.length; i++) {
      if (divs[i].style.zIndex) {
        if (parseInt(divs[i].style.zIndex) > max) {
          max = parseInt(divs[i].style.zIndex)
        }
      }
    }
    if (max !== selfzIndex) {
      callb && callb(Number(max) + 1)
    }
  })
}
