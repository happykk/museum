<template>
  <section>
    <div class="detail-main">
      <div class="user-info" v-if="detail">
        <h3 class="name">{{detail.name}}</h3>
        <div class="row">
          <span class="left">预约证件号</span>
          <span class="right">{{detail.code}}</span>
        </div>
        <div class="row">
          <span class="left">预约参观日期</span>
          <span class="right">{{detail.appointment_time}}</span>
        </div>
        <span :class="['status', detail.statusAlias=='已取票'?'success':'fail']" v-if="detail.statusAlias!=='未取票'">{{detail.statusAlias}}</span>
      </div>
      <div class="line"></div>
      <div class="ticket-img">
        <div class="qrcode" ref="qrCodeUrl"></div>
        <p>请在取票机上选择二维码取票后，将手机屏幕对准扫描窗口</p>
      </div>
    </div>
    <span class="btn" v-if="detail&&detail.statusAlias=='未取票'" @click="handleCancel">取消预约</span>
  </section>
</template>

<script>
import Vue from 'vue'
import QRCode from 'qrcodejs2'
import { Toast } from 'vant'
Vue.use(Toast)
export default {
  data () {
    return {
      detail: null
    }
  },
  methods: {
    creatQrCode (val) {
      new QRCode(this.$refs.qrCodeUrl, {
        text: val,
        width: 186,
        height: 186
        // colorDark: '#000000',
        // colorLight: '#ffffff',
        // correctLevel: QRCode.CorrectLevel.H
      })
    },
    getQrCode () {
      this.$ajax.get('http://115.159.94.87/api/appointment/get_qr_code', {
        ticket_no: this.detail.ticket_no,
        open_id: 'oOmVn5seW0rnwygK1wP_Xbn4z1T4'
      }).then(res => {
        this.creatQrCode(res.data)
      })
    },
    handleCancel () {
      this.$ajax.get('http://115.159.94.87/api/appointment/del_qr_code', {
        ticket_no: this.detail.ticket_no,
        open_id: 'oOmVn5seW0rnwygK1wP_Xbn4z1T4'
      }).then(res => {
        if (res.code === 0) {
          this.detail.statusAlias = '已取消'
          Toast.success('操作成功')
        }
      })
    }
  },
  mounted () {
    if (sessionStorage.getItem('detail')) {
      this.detail = JSON.parse(sessionStorage.getItem('detail'))
      this.getQrCode()
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-main{
  background: #FFFFFF;
  border-radius: 10px;
  margin: 16px;
  .user-info{
    padding: 24px 30px;
    position: relative;
    h3{
      font-size: 18px;
      font-weight: 500;
      color: #161616;
      line-height: 26px;
    }
    .row{
      margin: 15px 0 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left{
        font-size: 14px;
        color: rgba(22,22,22,0.60);
      }
      .right{
        font-size: 13px;
        color: rgba(22,22,22,0.40);
      }
    }
  }
  .line{
    width: 100%;
    height: 10px;
    background: url('~@/assets/images/Group3@2x.png') no-repeat;
    background-size: 100%;
  }
  .status{
    position: absolute;
    top: 18px;
    right: 0;
    width: 106px;
    height: 34px;
    font-size: 14px;
    line-height: 34px;
    text-align: center;
    border-radius: 100px 0 0 100px;
  }
  .success{
    color: #B41700;
    background: #F0D1CC;
  }
  .fail{
    color: rgba(102,102,102,0.60);
    background:  rgba(102,102,102,0.20);
  }
  .ticket-img{
    padding: 50px 42px 44px;
    .qrcode{
      width: 186px;
      height: 186px;
      margin: 0 auto;
      background: #d8d8d8;
      /deep/img{
        width: 100%;
      }
    }
    p{
      margin-top: 54px;
      font-size: 14px;
      color: rgba(22,22,22,0.60);
      line-height: 24px;
    }
  }
}
.btn{
  display: block;
  margin: 45px auto 0;
  width: 230px;
  line-height: 44px;
  background: #B41700;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  border-radius: 6px;
}
</style>