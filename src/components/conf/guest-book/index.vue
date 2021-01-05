<template>
  <section class="appointment-warpper">
    <div class="form-main">
      <vantForm ref="vanForm" :rules="rules" inputVail="true" >
        <template slot="items">
          <van-field label="您的姓名：" v-model="formData.name"
          input-align="right" placeholder="请输入您的姓名"
          error-message="请输入姓名~" rule="name" />
          <van-field v-model="formData.phone" type="tel" label="您的手机号"
          input-align="right" placeholder="请输入您的手机号"
          error-message="请输入正确的手机号~" rule="phone"
          />
          <van-field v-model="formData.mail" label="您的邮箱地址"
          input-align="right" placeholder="请输入您的邮箱"/>
          <van-field v-model="formData.content" label="留言内容"
            rows="5" class="textarea-box"
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
        name: '',
        phone: '',
        mail: '',
        content: ''
      },
      rules: {
        'name': {required: true},
        'phone': {regExp: /^1[34578]\d{9}$/, required: true}
        // 'mail': {regExp: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/}
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
      if (!this.formData.content) {
        Toast('请输入留言')
        return
      }
      if (this.$refs['vanForm'].allVail()) {
        this.$ajax.post('//api.xiangtanmuseum.com/api/message/create', this.formData).then(res => {
          if (res.code === 0) {
            Toast.success('提交成功')
            this.formData = {
              name: '',
              phone: '',
              mail: '',
              content: ''
            }
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