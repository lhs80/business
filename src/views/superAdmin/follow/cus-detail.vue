<template>
  <section class="p2">
    <el-row>
      <el-col :span="12">
        <div>客户姓名：{{customInfo.name}} 跟进人：{{customInfo.follows_names}}</div>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button type="primary" size="small" @click="showExportCustomer=true">添加订单</el-button>
        <el-button type="primary" size="small" @click="">转移至客户公海</el-button>
        <el-button type="danger" size="small" @click="">删除</el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本资料" name="first">
        <ul>
          <li>姓名：{{customInfo.name}}</li>
          <li>电话：{{customInfo.phone}}</li>
          <li>地址：{{customInfo.province}}{{customInfo.city}}{{customInfo.county}}{{customInfo.address}}</li>
          <li>品牌：{{customInfo.brand_names}}</li>
          <li>微信：{{customInfo.wechat}}</li>
          <li>类型：{{customInfo.type}}</li>
          <li>创建时间：moment({{customInfo.cdate}}).format("YYYY-MM-DD")</li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="客户订单" name="second">
        <el-table :data="orderList" stripe style="width: 100%">
          <el-table-column label="商品名称"></el-table-column>
          <el-table-column label="规格数量"></el-table-column>
          <el-table-column label="订单价格"></el-table-column>
          <el-table-column label="下单日期"></el-table-column>
          <el-table-column label="业务所属"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="客户交易" name="third">
        <el-table>
          <el-table-column label="累计交易"></el-table-column>
          <el-table-column label="平均单价"></el-table-column>
          <el-table-column label="累计订单"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="跟进动态" name="fourth">
        <div>
          <el-button size="small" type="primary">写跟进</el-button>
        </div>
        <div></div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
  import {queryCustomDetailFun, queryCustomOrderListFun, getMyCustomerOrdersFun} from '@/api/activity'
  import moment from 'moment'

  export default {
    data() {
      return {
        activeName: 'first',
        cusId: this.$route.query.id,
        customInfo: {},
        orderList: []
      }
    },
    mounted() {
      this.getCusDetail();
      this.getCusOrderList()
    },
    methods: {
      getCusDetail() {
        let params = {
          id: this.cusId
        };

        queryCustomDetailFun(params).then(res => {
          if (res.data.success) {
            this.customInfo = res.data.data;
          }
        })
      },
      getCusOrderList() {
        let params = {
          id: this.cusId,
          pageIndex: 1,
          pageSize: 15
        };
        queryCustomOrderListFun(params).then(res => {
          if (res.data.success) {
            this.orderList = res.data.data;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
