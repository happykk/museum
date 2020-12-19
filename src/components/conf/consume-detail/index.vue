<template>
  <div class="consume">
    <div class="head">
      <p><img src="@/assets/images/icon_2.png">单号：{{detailObj.billNo}}</p>
      <p><img src="@/assets/images/icon_1.png">时间：{{detailObj.saleDate}}</p>
    </div>
    <div class="box-wrap">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <td>商品</td>
              <td>单价</td>
              <td>数量</td>
              <td>金额</td>
            </tr>
          </thead>
          <tbody v-if="detailObj.product">
            <tr v-for="(item, index) in detailObj.product" :key="index">
              <td>{{item.itemDesc}}</td>
              <td>￥{{detailObj.isNew?item.oldPrice:item.salePrice}}</td>
              <td>{{item.qty}}</td>
              <td>
                ￥{{item.amt}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="total-wrap">
        <div class="num">
          <h3>合计数量：{{detailObj.num}}</h3>
        </div>
        <div class="count">
          <h3>实付金额：<span>￥{{detailObj.isNew?detailObj.finalTotalPayAmt:detailObj.totalPayAmtReal}}</span></h3>
          <p>商品金额总计：￥{{detailObj.isNew?detailObj.oldAmt:detailObj.productAmt}}</p>
          <!-- <p>运费总计：￥10</p> -->
          <p v-if="detailObj.discountsChannel">优惠金额：￥{{detailObj.discountsChannel.selfAndBbgAmt}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      posId: '',
      storeId: '',
      memberId: '',
      billNo: '',
      detailObj: {}
    }
  },
  methods: {
    getDetail (query) {
      this.$ajax.get('//customer.yunhou.com/api/qiye_wechat/ticketsDetail', query).then((res) => {
        if (res.error === 0) {
          this.detailObj = res.data
        }
      })
    }
  },
  mounted () {
    document.title = '最近一次消费详情'
    this.getDetail(this.$route.query || {})
  }
}
</script>
<style lang="scss" scoped>
.consume {
  .head {
    padding: 30px;
    border-radius: 0 0 30px 30px;
    background: #fff;
    p {
      font-size: 28px;
      img {
        width: 38px;
        margin-right: 20px;
        vertical-align: middle;
        position: relative;
        top: -4px;
      }
    }
    p+p{
      margin-top: 8px;
    }
  }
  .box-wrap {
    margin-top: 25px;
    .table-wrap {
      table {
        width: 100%;
        padding: 30px;
        font-size: 26px;
        thead {
          tr {
            td {
              background: linear-gradient(to bottom,#fff, #eff6fc);
            }
            td:first-child {
              border-radius: 30px 0 0 30px;
            }
            td:last-child {
              border-radius: 0 30px 30px 0;
            }
          }
        }
        tbody {
          border-radius: 30px;
          background: #fff;
          tr:first-child {
            td {
              background: #fff;
            }
            td:first-child {
              border-radius: 30px 0 0 0;
            }
            td:last-child {
              border-radius: 0 30px 0 0;
            }
          }
          td {
            border-bottom: 1px solid #efefef;
          }
          tr {
            td:first-child {
              position: relative;
              &::before {
                content: '';
                background: #fff;
                height: 4px;
                position: absolute;
                width: 30px;
                left: 0;
                bottom: -2px;
              }
            }
            td:last-child {
              position: relative;
              &::before {
                content: '';
                background: #fff;
                height: 4px;
                position: absolute;
                width: 30px;
                right: 0;
                bottom: -2px;
              }
            }
          }
        }
        td {
          padding: 15px 30px;
        }
      }
    }
    .total-wrap {
      display: flex;
      justify-content: space-between;
      padding: 20px 20px 15px 20px;
      background: #fff;
      border-radius: 0 0 30px 30px;
      .num {
        h3 {
          font-size: 30px;
          font-weight: 500;
        }
      }
      .count {
        text-align: right;
        h3 {
          font-size: 30px;
          font-weight: 500;
        }
        p {
          font-size: 24px;
          color: #666;
        }
      }
    }
  }
}
</style>