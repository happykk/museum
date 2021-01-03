<template>
  <section class="appointment-warpper">
    <div class="form-main">
      <vantForm ref="vanForm" :rules="rules" inputVail="true" >
        <template slot="items">
          <van-field label="您的姓名：" v-model="formData.realName"
          input-align="right" placeholder="请输入您的姓名"
          error-message="请输入姓名~" rule="realName" />
          <van-field v-model="formData.realPhone" type="tel" label="您的手机号"
          input-align="right" placeholder="请输入您的手机号"
          error-message="请输入正确的手机号~" rule="realPhone"
          />
          <van-field v-model="formData.email" label="您的邮箱地址"
          input-align="right" placeholder="请输入您的邮箱"
          error-message="请输入正确的邮箱~" rule="email"/>
          <van-field v-model="formData.content" label="留言内容"
            rows="5" class="textarea-box"
            autosize
            type="textarea"
            maxlength="200"
            placeholder="请输入留言"
            show-word-limit
          />
        </template>
      </vantForm>
      <span class="btn" @click="submit">提交留意</span>
    </div>
  </section>
</template>

<script>
import VantForm from '@/components/common/validate'
import { Toast } from 'vant'
export default {
  components: {
    VantForm
  },
  data () {
    return {
      formData: {
        realName: '',
        realPhone: '',
        emai: '',
        content: ''
      },
      rules: {
        'realName': {required: true},
        'realPhone': {regExp: /^1[34578]\d{9}$/, required: true},
        'emai': {regExp: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/, required: true}
      },
      openId: ''
    }
  },
  methods: {
    onConfirmDate (value) {
      this.selectDate = value
      this.showDatePicker = false
    },
    onConfirmCard (value) {
      this.showCardPicker = false
    },
    onConfirmChildren (value) {
      this.tickets[this.childrenIndex].children = value
      this.showChildrenPicker = false
    },
    showSelectChildren (index) {
      this.childrenIndex = index
      this.showChildrenPicker = true
    },
    submit () {
      if (!this.isAgree) {
        Toast('请勾选我已阅读')
        return
      }
      if (!this.selectDate) {
        Toast('请选择参观日期')
        return
      }
      let arr = []
      this.$refs['vanForm'].forEach(item => {
        if (item.allVail()) {
          arr.push(1)
        }
      })
      if (arr.length === this.$refs['vanForm'].length) {
        let ticketList = []
        this.tickets.forEach(ticket => {
          let {realName, realPhone, children, idCard} = ticket
          let obj = {
            realName,
            realPhone,
            idCard,
            children: children || 0,
            date: this.selectDate
          }
          ticketList.push(obj)
        })
        let params = {
          openId: this.openId,
          tickets: JSON.stringify(ticketList)
        }
        this.$ajax.post('//admin.xiangtanmuseum.com/users/appointment', params).then(res => {
          if (res.code === 0) {
            Toast.success('预约成功')
            window.scrollTo(0, 0)
            this.$router.push('my-ticket')
          }
        })
      }
    }
  },
  created () {
    document.title = '留言簿'
    this.openId = localStorage.getItem('openId')
  }
}
</script>

<style lang="scss" scoped>
.appointment-warpper{
  min-height: 100vh;
  background: #fff;
}
.btn{
  display: block;
  margin: 40px auto 30px;
  width: 230px;
  line-height: 44px;
  text-align: center;
  color: #fff;
  font-size: 15px;
  background: #B41700;
  border-radius: 6px;
}
.textarea-box{
  display: block;
  /deep/.van-cell__value{
    margin: 5px 0;
    background: rgba(241,240,245,0.60);
    border: 1px solid #F1F0F5;
    border-radius: 4px;
    padding: 14px;
  }
}
</style>