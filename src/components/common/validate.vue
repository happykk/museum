<template>
  <div>
   <slot name="items"></slot>
  </div>
</template>
<script>
export default {
  name: 'vant-form',
  data () {
    return {
      rulesEles: []
    }
  },
  props: ['inputVail', 'rules'],
  mounted () {
    // 递归获取所有带有 rule 属性的元素
    this.rulesEles = this.getRuleEle(this.$slots.items)
    // 处理 输入监听的校验
    if (this.inputVail) this.eleSetInput()
  },
  methods: {
    // 递归获取插槽内所有拥有 input 属性的元素【内部方法】
    getRuleEle (eleObj) {
      let childs = []
      if (!eleObj) return
      // 循环所有元素（兼容 对象和数组的情况）
      for (let i in eleObj instanceof Array ? eleObj : [eleObj]) {
        let ele = eleObj[i]
        // 当前元素包含 rule 属性，则收录起来
        if (ele.data && ele.data.attrs['rule']) {
          ele.elm.getElementsByClassName('van-field__error-message')[0].style.display = 'none'
          childs.push(ele)
        }
        // 当前元素存在子元素，则递归查询
        ele.children && childs.push.apply(childs, this.getRuleEle(ele.children))
      }
      return childs
    },
    // 设置 需要校验的属性 的 input监听 校验 【内部方法】
    eleSetInput () {
      let self = this
      try {
        for (let i in self.rulesEles) {
          (function (index) {
            // 获取元素下 input 元素（目前只针对 单个输入框做处理）
            let inputEle = self.rulesEles[index].elm.getElementsByTagName('input')[0]
            inputEle.oninput = function () {
              // 输入实时校验
              self.handleVail(index)
            }
          })(i)
        }
      } catch (e) {
        console.error('vail error：' + e)
      }
    },
    // 检验元素的值是否满足条件（参数：索引值 ）【内部方法】
    handleVail (i) {
      try {
        let handleEle = this.rulesEles[i]
        // 获取元素下 input 元素（目前只针对 单个输入框做处理）
        let inputValue = handleEle.elm.getElementsByTagName('input')[0].value
        let vailFlag = true
        // 获取设置的校验规则
        let ruleObj = this.rules ? this.rules[handleEle.data.attrs['rule']] : null
        if (!ruleObj) return vailFlag
        // 非空校验
        vailFlag = ruleObj.required ? !!inputValue : vailFlag
        // 正则校验
        vailFlag = ruleObj.regExp ? ruleObj.regExp.test(inputValue) && vailFlag : vailFlag
        // 用户自定义校验
        vailFlag = typeof ruleObj.handleVailFun === 'function' ? ruleObj.handleVailFun(inputValue) && vailFlag : vailFlag
        // 获取组件实例，修改错误信息(注释的代码可以实现效果，但是违反了子组件修改父组件的规则)
        // handleEle.componentInstance.errorMessage = vailFlag?'':ruleObj.errorMessage
        // 目前是通过控制元素显示隐藏去实现错误信息的展示
        if (!vailFlag) this.rulesEles[i].elm.getElementsByClassName('van-field__error-message')[0].style.display = 'block'
        else this.rulesEles[i].elm.getElementsByClassName('van-field__error-message')[0].style.display = 'none'
        return vailFlag
      } catch (e) {
        console.error('vail error：' + e)
      }
    },
    // 整体校验【对外提供方法】
    allVail () {
      let vailFlag = true
      for (let i in this.rulesEles) {
        vailFlag = !this.handleVail(i) ? false : vailFlag && true
      }
      return vailFlag
    }
  }
}
</script>
<style lang="scss" scoped>
.form-content{
    position: relative;
    margin-bottom: 10px;
    .index{
      position: absolute;
      top: 12px;
      left: -16px;
      z-index: 2;
      width: 19px;
      text-align: center;
      line-height: 18px;
      font-size: 12px;
      color: rgba(180,23,0,0.60);
      background: rgba(180,23,0,0.20);
      border-radius: 0 2px 2px 0;
    }
  }
</style>
