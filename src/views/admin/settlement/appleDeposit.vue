<template>
  <section class="app-container calendar-list-container apply-list">
    <h1>余额提现</h1>
    <table class="tb-cash">
      <tr>
        <td>
          <p class="tips text-info">可提现金额</p>
          <h1>{{parseFloat(cashInfo.tx_able_money).toFixed(2)}}</h1>
          <el-button type="primary" size="small" @click="showAplication=true">申请提现</el-button>
        </td>
        <td>
          <p class="tips text-info">待结算金额</p>
          <h1>{{parseFloat(cashInfo.lock_money).toFixed(2)}}</h1>
        </td>
        <td>
          <p class="tips text-info">已结算金额</p>
          <h1>{{parseFloat(cashInfo.his_amount).toFixed(2)}}</h1>
        </td>
      </tr>
    </table>
    <!--提现确认弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="showAplication">
      <div class="el-message-box el-message-box--center" style="width:40%">
        <div class="bg-grey">
          <el-row class="prl2 ptb1">
            <el-col :span="12" class="h5">可提现金额(扣除服务费)</el-col>
            <el-col :span="12" class="text-right h5 text-info">平台服务费0.6%</el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <h1 class="text-warning mt2">{{parseFloat(cashInfo.tx_able_money-(cashInfo.tx_able_money*0.6)/100).toFixed(2)}}元</h1>
          <h3>没有扣除服务费前的金额：{{parseFloat(cashInfo.tx_able_money).toFixed(2)}}</h3>
          <el-form class="mt2" :model="txInfo" :rules="rules" ref="txInfo" label-width="100px">
            <el-form-item label="提现方式" class="text-left">
              <el-radio v-model="txInfo.tx_type" label="1">提现到银行卡</el-radio>
            </el-form-item>
            <el-form-item label="姓名" prop="tx_person">
              <el-input type="text" v-model="txInfo.tx_person" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="选择银行" prop="tx_bank_name">
              <el-select v-model="txInfo.tx_bank_name" placeholder="请选择选择银行">
                <el-option v-for="(item,index) in bankList" :key="index" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="银行卡号" prop="tx_card_code">
              <el-input type="text" v-model="txInfo.tx_card_code" placeholder="请输入银行卡号"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-message-box__btns">
          <el-button type="primary" @click="submitForm('txInfo')">提交</el-button>
          <el-button type="info" @click="showAplication=false"><span>取消</span></el-button>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="showAplication"></div>
  </section>
</template>
<script>
  import {applicationForCashFun, getSysSupportBanksFun, addTxOrderFun} from "@/api/activity"

  export default {
    data() {
      return {
        showAplication: false,
        cashInfo: {},
        bankList: [],
        txInfo: {
          tx_type: "1",
          tx_person: "",
          tx_card_code: "",
          tx_bank_name: "",
          tx_money: ""
        },
        rules: {
          tx_person: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
          ],
          tx_bank_name: [
            {required: true, message: '请选择银行卡', trigger: 'change'}
          ],
          tx_card_code: [
            {required: true, message: '请输入银行卡号', trigger: 'blur'}
          ]
        }
      };
    },
    mounted() {
      this.applicationForCash();
      this.getSysSupportBanks();
    },
    methods: {
      /**
       * 可提现的金额
       * */
      applicationForCash() {
        applicationForCashFun().then(res => {
          if (res.data.success) {
            console.log(res.data.data);
            this.cashInfo = res.data.data;
            this.txInfo.tx_money = this.cashInfo.tx_able_money - (this.cashInfo.tx_able_money * 0.6) / 100;
          }
        })
      },
      /**
       * 系统支持提现的银行
       * */
      getSysSupportBanks() {
        getSysSupportBanksFun().then(res => {
          if (res.data.success) {
            this.bankList = res.data.data;
          }
        })
      },
      /**
       * 提交提现申请
       */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addTxOrderFun(this.txInfo).then(res => {
              console.log(res);
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "申请提交成功",
                  type: "success",
                  center: true
                });
                this.showAplication = false
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "warning",
                  center: true
                });
              }
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
    }
  };
</script>
<style lang="scss" scoped>
  .tb-cash {
    border-collapse: collapse;
    td {
      width: 200px;
      position: relative;
      padding: 50px 30px;
      vertical-align: middle;
      border: solid 1px #e5e5e5;
      .tips {
        position: absolute;
        top: 10px;
        left: 15px;
      }
    }
  }
</style>
