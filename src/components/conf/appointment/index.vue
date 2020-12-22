<template>
  <section class="appointment-warpper">
    <ul class="tab-bar">
      <li :class="['tab-item', {'activeL': 0===currentTab}]" @click="changeTab(0)">参观指南</li>
      <li :class="['tab-item', {'activeR': 1===currentTab}]" @click="changeTab(1)">门票预约</li>
    </ul>
    <div class="guide-main" v-if="currentTab==0">
      <div v-html="guideInfo"></div>
    </div>
    <div class="form-main" v-if="currentTab==1">
      <div class="calender-box mob-block">
        <h3 class="block-title">请选择参观日期</h3>
        <van-field
          readonly
          clickable
          :value="selectDate"
          placeholder="请选择参观日期"
          @click="showDatePicker = true"
        />
        <i class="calender"></i>
        <p class="tips">*预约日期只可选择未来一周内</p>
      </div>
      <div class="mob-block">
        <h3 class="block-title">参观人员
          <span class="sub-title">（最多可添加3人）</span>
          <i class="add-icon" @click="addTicket" v-if="tickets.length<3"></i>
        </h3>
        <div v-for="(item, index) in tickets" :key="index" class="form-content">
          <span class="del-icon" @click="delTicket(index)" v-if="index>0"></span>
          <vantForm ref="vanForm" :rules="rules" inputVail="true" >
            <template slot="items">
              <van-field label="您的姓名：" v-model="item.realName"
                error-message="请输入姓名~" rule="realName">
              </van-field>
              <van-field v-model="item.cardType" label="证件类型："
                readonly clickable
                right-icon="arrow-down"
                @click="showCardPicker = true"
              />
              <van-field v-model="item.idCard" label="证件号码："
                error-message="请输入正确的证件号~" rule="idCard"/>
              <van-field v-model="item.realPhone" type="tel" label="手机号："
                error-message="请输入正确的手机号~" rule="realPhone"
              />
              <van-field v-model="item.children" 
              readonly clickable
              label="携带小孩数：" @click="showSelectChildren(index)"/>
            </template>
          </vantForm>
        </div>
      </div>
      <div class="mob-block">
        <h3 class="block-title">参观须知</h3>
        <div class="notice" v-html="appointmentInfo"></div>
      </div>
      <div class="footer">
        <van-radio name="1" checked-color="#B41700" v-model="isAgree">我已阅读并同意</van-radio>
        <span class="btn" @click="submit">预约门票</span>
      </div>
      <van-popup v-model="showChildrenPicker" round position="bottom">
        <van-picker
          show-toolbar
          :columns="childrenList"
          @cancel="showChildrenPicker = false"
          @confirm="onConfirmChildren"
        />
      </van-popup>
      <van-popup v-model="showCardPicker" round position="bottom">
        <van-picker
          show-toolbar
          :columns="cardList"
          @cancel="showCardPicker = false"
          @confirm="onConfirmCard"
        />
      </van-popup>
      <van-popup v-model="showDatePicker" round position="bottom">
        <van-picker
          show-toolbar
          :columns="dateList"
          @cancel="showDatePicker = false"
          @confirm="onConfirmDate"
        />
      </van-popup>
    </div>
  </section>
</template>

<script>
import VantForm from '@/components/common/validate'
import {weixinShouquan, getQueryString} from '@/components/common/util'
import { Toast, Dialog } from 'vant'
export default {
  components: {
    VantForm
  },
  data () {
    return {
      currentTab: 0,
      selectDate: '',
      guideInfo: '',
      appointmentInfo: '',
      showDatePicker: false,
      dateList: [],
      tickets: [{
        realName: '',
        idCard: '',
        cardType: '身份证',
        realPhone: '',
        children: ''
      }],
      showCardPicker: false,
      cardList: ['身份证'],
      rules: {
        'realName': {required: true},
        'realPhone': {regExp: /^1[34578]\d{9}$/, required: true},
        'idCard': {regExp: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/, required: true}
      },
      isAgree: false,
      childrenIndex: 0,
      showChildrenPicker: false,
      childrenList: [1, 2, 3],
      openId: 'oOmVn5seW0rnwygK1wP_Xbn4z1T4'
    }
  },
  methods: {
    getDateList () {
      this.$ajax.get('//museum.likeghost.club/act/conf').then(res => {
        if (res.code === 0) {
          this.dateList = res.data.own_select_date
        }
      })
    },
    addTicket () {
      this.tickets.push({
        realName: '',
        idCard: '',
        cardType: '身份证',
        realPhone: '',
        children: ''
      })
    },
    delTicket (index) {
      Dialog.confirm({
        title: '提示',
        message: '是否删除该预约人员?'
      }).then(() => {
        this.tickets.splice(index, 1)
      }).catch(() => {})
    },
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
        this.$ajax.post('//museum.likeghost.club/users/appointment', params).then(res => {
          if (res.code === 0) {
            Toast.success('预约成功')
            window.scrollTo(0, 0)
            this.$router.push('my-ticket')
          }
        })
      }
    },
    changeTab (val) {
      this.currentTab = val
    },
    getInfo (val) {
      this.$ajax.get('//museum.likeghost.club/desc/info', {logic_type: val}).then(res => {
        if (val === 1) {
          this.guideInfo = res.data.content
        } else {
          this.appointmentInfo = res.data.content
        }
      })
    },
    getUserOpenid (code, state) {
      this.$ajax.get('//museum.likeghost.club/wechat/code', {
        code: code,
        state: state
      }).then(res => {
        this.openId = res.data.openid
        localStorage.setItem('openId', res.data.openid)
      })
    }
  },
  created () {
    this.openId = localStorage.getItem('openId')
    if (this.openId) {
      return
    }
    let code = getQueryString('code') // 获取url参数code
    let state = encodeURIComponent(window.location.href)
    if (code) { // 拿到code， code传递给后台接口换取opend
      this.getUserOpenid(code, state)
    } else {
      weixinShouquan(state)
    }
  },
  async mounted () {
    this.getDateList()
    this.getInfo(1)
    this.getInfo(2)
  }
}
</script>

<style lang="scss" scoped>
.appointment-warpper{
  min-height: 100vh;
  margin-bottom: 93px;
}
.tab-bar{
  height: 38px;
  text-align: center;
  display: flex;
  // padding-top: 16px;
  .tab-item{
    width: 187px;
    height: 38px;
    line-height: 38px;
    font-size: 15px;
    font-weight: 500;
    color: rgba(22,22,22,0.40);
  }
  .activeL{
    color: #B41700;
    background: url('~@/assets/images/tab1@2x.png') no-repeat;
    background-size: 100%;
  }
  .activeR{
    color: #B41700;
    background: url('~@/assets/images/tab2@2x.png') no-repeat;
    background-size: 100%;
  }
}
.guide-main{
  background: #fff;
  padding: 24px;
  /deep/img{
    max-width: 100%;
  }
}
.form-main{
  .mob-block{
    background: #fff;
    padding: 10px 16px;
    position: relative;
    margin-bottom: 8px;
  }
  .calender{
    position: absolute;
    top: 56px;
    right: 32px;
    width: 16px;
    height: 16px;
    background: url('~@/assets/images/riqi-2@2x.png') no-repeat;
    background-size: 100%;
  }
  .block-title{
    padding: 8px 16px 5px;
    font-weight: 500;
    font-size: 14px;
    color: #161616;
    .sub-title{
      font-weight: 400;
      font-size: 12px;
      color: rgba(22,22,22,0.60);
    }
    .add-icon{
      width: 18px;
      height: 18px;
      float: right;
      background: url('~@/assets/images/add@2x.png') no-repeat;
      background-size: 100%;
    }
  }
  .tips{
    padding: 10px 16px;
    font-size: 12px;
    color: #B41700;
  }
  .footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 83px;
    padding: 5px 16px;
    box-sizing: border-box;
    background: #fff;
    /deep/.van-radio{
      float: left;
      font-size: 12px;
      color: rgba(22,22,22,0.60);
      margin-top: 12px;
    }
    .btn{
      float: right;
      width: 160px;
      line-height: 44px;
      background: #B41700;
      color: #fff;
      font-size: 15px;
      border-radius: 6px;
      text-align: center;
    }
  }
  .form-content{
    position: relative;
    margin-bottom: 10px;
    .del-icon{
      position: absolute;
      top: 8px;
      left: -18px;
      z-index: 2;
      width: 28px;
      height: 24px;
      background: url('~@/assets/images/del-icon.png') no-repeat;
      background-size: 100%;
    }
  }
}
</style>