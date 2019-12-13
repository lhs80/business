<template>
  <div class="app-container calendar-list-container client-list">
    <!--菜单栏-->
    <el-row>
      <el-col :span="12">
        <span class="h5 prl1">已选择0位客户</span>
        <el-button type="primary" size="small" @click="showExportCustomer=true">导入客户</el-button>
        <el-button type="primary" size="small" @click="changeGoodStatus(0)">转入到我的跟进客户</el-button>
        <el-button type="danger" size="small" @click="passCheck()">删除</el-button>
      </el-col>
      <el-col :span="12" class="text-right">
        <span class="h5">客户意向：</span>
        <div style="width:100px;display:inline-block;">
          <el-select size="small" v-model="txInfo.serachName" placeholder="请选择">
            <el-option value="tx_code" label="提现单号">全部</el-option>
            <el-option value="tx_code" label="提现单号">成交</el-option>
            <el-option value="m_name" label="商户名称">未成交</el-option>
          </el-select>
        </div>
        <span class="h5">转入时间：</span>
        <div style="width:100px;display:inline-block;">
          <el-select size="small" v-model="txInfo.serachName" placeholder="请选择">
            <el-option value="tx_code" label="提现单号">今天</el-option>
            <el-option value="tx_code" label="提现单号">昨天</el-option>
            <el-option value="m_name" label="商户名称">本周</el-option>
            <el-option value="m_name" label="商户名称">上周</el-option>
            <el-option value="m_name" label="商户名称">本月</el-option>
            <el-option value="m_name" label="商户名称">上月</el-option>
            <el-option value="m_name" label="商户名称">自定义时间段</el-option>
          </el-select>
        </div>
        <div style="width:150px;display:inline-block;">
          <el-input size="small" v-model="txInfo.searchKey" placeholder="请输入关键字"></el-input>
        </div>
        <div style="display:inline-block;">
          <el-button type="primary" size="small" @click="getCustomerList">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="txList" stripe style="width: 100%">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="tx_code" label="客户姓名"></el-table-column>
      <el-table-column prop="m_name" label="客户电话"></el-table-column>
      <el-table-column prop="tx_type" label="客户微信">
        <template slot-scope="scope">
          {{scope.row.tx_type===1?"银行卡":""}}
        </template>
      </el-table-column>
      <el-table-column prop="tx_money" label="客户地址">
        <template slot-scope="scope">
          <span>￥{{scope.row.tx_money}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tx_charge" label="品牌">
        <template slot-scope="scope">
          <span>￥{{scope.row.tx_charge}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tx_real_money" label="创建时间">
        <template slot-scope="scope">
          <span class="text-warning">￥{{scope.row.tx_real_money}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cdate" label="跟进人">
        <template slot-scope="scope">
          <span>{{timestampToTime(scope.row.cdate)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="paginations.total > 0"
      :page-sizes="paginations.pageSizes"
      :page-size="paginations.page_size"
      :layout="paginations.layout"
      :total="paginations.total"
      :current-page="paginations.page_index"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!--    导入客户-->
    <el-dialog title="导入客户" :visible="showExportCustomer">
      <el-form :model="customerInfo">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.wxChat" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showExportCustomer = false">取消</el-button>
        <el-button type="primary" @click="saveCustomer()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {adminTxOrderListFun, adminHandleTxOrderFun} from "@/api/activity"

  export default {
    data() {
      return {
        formLabelWidth: '120px',
        showExportCustomer: false,
        txList: [],
        timeRange: "",
        customerInfo: {
          name: '',
          tel: '',
          address: '',
          wxChat: ''
        },
        txInfo: {
          serachName: ''
        },
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        },
      }
    },
    mounted() {

    },
    methods: {
      getCustomerList() {
      },
      saveCustomer() {
        this.showExportCustomer = false;
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.getOrderList();
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.getOrderList()
      },
    }
  };
</script>
