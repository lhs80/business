<template>
  <div class="app-container calendar-list-container client-list">
    <div class="client-set-option"></div>
    <el-table :data="txList" stripe style="width: 100%">
      <el-table-column prop="tx_code" label="提现单号"></el-table-column>
      <el-table-column prop="m_name" label="商户"></el-table-column>
      <el-table-column prop="tx_type" label="提现方式">
        <template slot-scope="scope">
          {{scope.row.tx_type===1?"银行卡":""}}
        </template>
      </el-table-column>
      <el-table-column prop="tx_money" label="申请金额">
        <template slot-scope="scope">
          <span>￥{{scope.row.tx_money}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tx_charge" label="服务费">
        <template slot-scope="scope">
          <span>￥{{scope.row.tx_charge}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tx_real_money" label="实际到账">
        <template slot-scope="scope">
          <span class="text-warning">￥{{scope.row.tx_real_money}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cdate" label="申请时间">
        <template slot-scope="scope">
          <span>{{timestampToTime(scope.row.cdate)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tx_status" label="状态">
        <template slot-scope="scope">
          <span v-html="getTxStatus(scope.row.tx_status)"></span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {getTxOrderListFun} from "@/api/activity"

  export default {
    data() {
      return {
        txList: []
      }
    },
    watch: {
      "$route": "getTxOrderList"
    },
    mounted() {
      this.getTxOrderList();
    },
    methods: {
      getTxOrderList() {
        let params = {
          tx_status: this.$route.query.type
        };
        getTxOrderListFun(params).then(res => {
          if (res.data.success) {
            this.txList = res.data.data.data;
          }
        })
      },
      getTxStatus(type) {
        switch (type) {
          case 1:
            return "<span class='text-info'>审核中</span>";
          case 2:
            return "<span class='text-success'>审核通过</span>";
          case 0:
            return "<span class='text-muted'>无效</span>";
          case -1:
            return "<span class='text-warning'>撤消</span>";
        }
      }
    }
  };
</script>
<style scoped>
</style>
