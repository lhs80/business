<template>
  <div class="app-container calendar-list-container client-list">
    <div class="client-set-option"></div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="orderNum" label="单号" width="180"></el-table-column>
      <el-table-column prop="shanghu" label="商户" width="180"></el-table-column>
      <el-table-column prop="tixianfangshi" label="提现方式"></el-table-column>
      <el-table-column prop="shenqingjine" label="申请金额"></el-table-column>
      <el-table-column prop="fuwufei" label="服务费"></el-table-column>
      <el-table-column prop="shijidaozhang" label="实际到账"></el-table-column>
       <el-table-column prop="time" label="申请时间"></el-table-column>
        <el-table-column prop="state" label="状态"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
    data(){
        return {
        tableData: [{
         orderNum:'12345',
         shanghu:'读后感',
         tixianfangshi:'银行卡',
         shenqingjine:'4000',
         fuwufei:'8',
         shijidaozhang:'3992',
          time: '2016-05-02',
          state: '申请中'
        }, {
         orderNum:'12345',
         shanghu:'读后感',
         tixianfangshi:'银行卡',
         shenqingjine:'4000',
         fuwufei:'8',
         shijidaozhang:'3992',
          time: '2016-05-02',
          state: '申请中'
        },{
         orderNum:'12345',
         shanghu:'读后感',
         tixianfangshi:'银行卡',
         shenqingjine:'4000',
         fuwufei:'8',
         shijidaozhang:'3992',
          time: '2016-05-02',
          state: '申请中'
        }]
      }
    }
};
</script>
<style scoped>
</style>
