<template>
  <section class="p2">
    <el-steps :active="detail.order_status" finish-status="finish" align-center class="mt2">
      <el-step title="买家下单" :description="timestampToTime(detail.cdate)"></el-step>
      <el-step title="买家付款" :description="timestampToTime(detail.udate)"></el-step>
      <el-step title="商家发货" :description="timestampToTime(detail.delive_start_time)"></el-step>
      <el-step title="订单完成" :description="timestampToTime(detail.complete_time)"></el-step>
    </el-steps>
    <!--订单信息-->
    <table class="order-detail-info">
      <tr>
        <td>
          <h6><span class="text-muted">订单编号：</span>{{detail.order_id}}</h6>
          <h6><span class="text-muted">付款方式：</span>{{detail.pay_type===1?"微信":"支付宝"}}</h6>
          <h6><span class="text-muted">买家：</span>{{detail.nick_name}}</h6>
          <h6><span class="text-muted">配送方式：</span>{{detail.delive_express_name}}</h6>
          <h6>
            <span class="text-muted">收货人：</span>
            {{detail.address}},{{detail.receipt_person}},{{detail.receipt_phone}}
          </h6>
          <el-button type="primary" size="small" class="mt2" @click="isShowUpdateAddress=true">修改订单收货地址</el-button>
          <h6 class="text-muted mt1">收货地址仅在发货前可改，发货后不可修改。</h6>
        </td>
        <td>
          <h6><span class="text-muted">订单状态：</span><span class="h1" v-html="orderType(detail.order_status)"></span></h6>
          <div class="mt2" v-if="detail.order_status===3||detail.order_status===4">
            <h6><span class="text-muted">快递公司：</span>{{detail.delive_express_name}}</h6>
            <h6>
              <span class="text-muted">快递单号：</span>{{detail.express_code}}
              <span class="text-info prl1 text-link" @click="isShowDelive=true">查看物流</span></h6>
            <h6><span class="text-muted">发货时间：</span>{{timestampToTime(detail.delive_start_time)}}</h6>
          </div>
        </td>
      </tr>
    </table>
    <h2 style="width:80%;margin:0 auto"><b>商品信息</b></h2>
    <!--商品信息-->
    <table class="order-detail-product-info">
      <tr>
        <th>商品标题</th>
        <th>规格</th>
        <th>单价</th>
        <th>数量</th>
        <th>价格</th>
      </tr>
      <tr v-for="(gooditem,key) in detail.goods" :key="key">
        <td>
          <img width="60px" height="60px" :src="gooditem.logo" style="vertical-align:middle"/>
          <span class="prl1">{{gooditem.goods_name}}</span>
        </td>
        <td class="prl1">
          <span v-for="(attrItem,subIndex) in gooditem.norm_snap" :key="subIndex" class="text-muted prl1">{{attrItem.sub_name}}</span>
        </td>
        <td class="text-muted text-center">￥{{gooditem.dlprice}}</td>
        <td class="text-muted text-center">x{{gooditem.count}}</td>
        <td class="text-muted text-center">￥{{gooditem.dlprice*gooditem.count}}</td>
      </tr>
      <tr>
        <td colspan="5" class="text-right">
          <h5>商品小计：{{detail.order_total}}</h5>
          <h5>运费：{{detail.express_cost}}</h5>
          <h5>实付：{{detail.pay_total}}</h5>
        </td>
      </tr>
    </table>
    <!--物流弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="isShowDelive">
      <div class="el-message-box el-message-box--center">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">查看物流</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowDelive=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <div v-if="detail.delive_traces&&!detail.delive_traces.length">{{detail.delive_state_str}}</div>
          <el-steps :active="1" direction="vertical" v-else :space="80" finish-status="finish" class="mt2">
            <el-step v-for="(item,index) in detail.delive_traces" :key="index" simple>
              <h5 slot="title">{{item.AcceptStation}}</h5>
              <h5 slot="description">{{item.AcceptTime}}</h5>
              <i slot="icon" class="iconfont icon-dian"></i>
            </el-step>
          </el-steps>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="isShowDelive=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowDelive"></div>
    <!--修改地址-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="isShowUpdateAddress">
      <div class="el-message-box el-message-box--center" style="width:30%">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">编辑收货地址</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowUpdateAddress=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-form ref="form" :model="address" label-width="80px">
            <el-form-item label="收货人">
              <el-input v-model="address.pname"></el-input>
            </el-form-item>
            <el-form-item label="手机" class="text-left">
              <el-input v-model="address.phone"></el-input>
            </el-form-item>
            <el-form-item label="地址">{{detail.address}}</el-form-item>
            <el-form-item label="新地址">
              <div class="chushou-btn">
                <div class="client-edit-level">
                  <el-select v-model="address.province" placeholder="请选择" @change="provinceChange">
                    <el-option
                      v-for="(item,index) in province"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div class="client-edit-level">
                  <el-select v-model="address.city" placeholder="请选择" @change="cityChange">
                    <el-option
                      v-for="(item,index) in city"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div class="client-edit-level">
                  <el-select v-model="address.county" placeholder="请选择">
                    <el-option
                      v-for="item in county"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div>
                <el-input v-model="address.detail_address"></el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="updateOrderss">
            <span>保存</span>
          </button>
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="isShowUpdateAddress=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowUpdateAddress"></div>
  </section>
</template>
<script>
  import {getOrderDetailFun, updateOrderAddressFun} from "@/api/activity"
  import ChinaAddress from '@/common/china_address_v4.json'

  export default {
    data() {
      return {
        detail: {},
        isShowDelive: false,
        isShowUpdateAddress: false,
        province: Object.keys(ChinaAddress),
        city: [],
        county: [],
        address: {
          order_id: this.$route.query.id,
          pname: "",
          phone: "",
          province: "",
          city: "",
          county: "",
          detail_address: "",
        }
      }
    },
    mounted() {
      this.getOrderDetail();
    },
    methods: {
      getOrderDetail() {
        let params = {
          order_id: this.$route.query.id
        };
        getOrderDetailFun(params).then(res => {
          console.log(res);
          if (res.data.success) {
            this.detail = res.data.data;
            this.address.pname = this.detail.receipt_person;
            this.address.phone = this.detail.receipt_phone;
          }
        })
      },
      //订单状态
      orderType(type) {
        switch (type) {
          case 0:
            return "已取消";
          case 1:
            return "<span class='text-danger'>待支付</span>";
          case 2:
            return "<span class='text-info'>待发货</span>";
          case 3:
            return "<span class='text-warning'>待收货</span>";
          case 4:
            return "<span class='text-success'>已完成</span>";
          case -1:
            return "<span>已关闭</span>";
        }
      },
      //  修改地址
      updateOrderss() {
        updateOrderAddressFun(this.address).then(res => {
          console.log(res)
          if (res.data.success) {
            this.isShowUpdateAddress = false;
            this.getOrderDetail();
          }
        })
      },
      provinceChange(value) {
        this.city = Object.keys(ChinaAddress[value]);
      },
      cityChange() {
        this.county = ChinaAddress[this.address.province][this.address.city]
      }
    }
  }
</script>
<style scoped lang="scss">
  .order-detail-info {
    width: 80%;
    margin: 40px auto;
    border-collapse: collapse;
    td {
      width: 50%;
      padding: 40px 30px;
      border: solid 1px #e5e5e5;
      vertical-align: top;
    }
  }

  .order-detail-product-info {
    width: 80%;
    margin: 40px auto;
    border-collapse: collapse;
    td, th {
      padding: 10px 20px;
      border: solid 1px #e5e5e5;
      vertical-align: middle;
    }
  }

  .client-edit-level {
    float: left;
    width: 33.333%;
  }

  .client-filter {
    float: left;
    margin-left: 10px;
  }

  .chushou-btn {
    height: 55px;
  }
</style>
