const baseSize = 16
// 设置 rem 函数
function setRem () {
  const scale = document.documentElement.clientWidth / baseSize
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = scale + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}
