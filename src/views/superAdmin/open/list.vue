<template>
  <div class="app-container calendar-list-container client-list">
    <!--菜单栏-->
    <el-row>
      <el-col :span="12">
        <span class="h5 prl1">已选择0位客户</span>
        <el-button type="primary" size="small" @click="showExportCustomer=true">导入客户</el-button>
        <el-button type="primary" size="small" @click="changeToMyCustomer()">转入到我的跟进客户</el-button>
        <el-button type="danger" size="small" @click="del()">删除</el-button>
      </el-col>
      <el-col :span="12" class="text-right">
        <span class="h5">客户意向：</span>
        <div style="width:100px;display:inline-block;">
          <el-select size="small" v-model="searchParams.intention" placeholder="请选择">
            <el-option value="1" label="未成交">未成交</el-option>
            <el-option value="2" label="老客户">老客户</el-option>
          </el-select>
        </div>
        <span class="h5">转入时间：</span>
        <div style="width:100px;display:inline-block;">
          <el-select size="small" v-model="searchParams.dateType" placeholder="请选择">
            <el-option value="1" label="今天">今天</el-option>
            <el-option value="1" label="今天">今天</el-option>
            <el-option value="2" label="昨天">昨天</el-option>
            <el-option value="3" label="本周">本周</el-option>
            <el-option value="4" label="本月">本月</el-option>
            <el-option value="5" label="上月">上月</el-option>
            <el-option value="m_name" label="自定义时间段">自定义时间段</el-option>
          </el-select>
        </div>
        <div style="width:150px;display:inline-block;">
          <el-input size="small" v-model="searchParams.searchKey" placeholder="请输入关键字"></el-input>
        </div>
        <div style="display:inline-block;">
          <el-button type="primary" size="small" @click="getCustomerList">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="txList" stripe style="width: 100%">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="客户姓名"></el-table-column>
      <el-table-column prop="phone" label="客户电话"></el-table-column>
      <!--      <el-table-column prop="wechat" label="客户微信"></el-table-column>-->
      <el-table-column prop="tx_money" label="客户地址">
        <template slot-scope="scope">
          <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.county}}{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brand_names" label="品牌"></el-table-column>
      <el-table-column prop="cdate" label="创建时间">
        <template slot-scope="scope">
          <span class="text-warning">{{scope.row.cdate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="follows_names" label="跟进人"></el-table-column>
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
          <el-input v-model="customerInfo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="customerInfo.province" autocomplete="off"></el-input>
          <el-input v-model="customerInfo.city" autocomplete="off"></el-input>
          <el-input v-model="customerInfo.county" autocomplete="off"></el-input>
          <el-input v-model="customerInfo.address" autocomplete="off"></el-input>
        </el-form-item>
        <!--        <el-form-item label="微信" :label-width="formLabelWidth">-->
        <!--          <el-input v-model="customerInfo.wxchat" autocomplete="off"></el-input>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showExportCustomer = false">取消</el-button>
        <el-button type="primary" @click="saveCustomer()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {openCustomerList, exportCustomerFun, delOpenCustomer, changeToMyCustomerFun} from "@/api/activity"

  export default {
    data() {
      return {
        formLabelWidth: '120px',
        showExportCustomer: false,
        txList: [],
        timeRange: "",
        customerInfo: {},
        txInfo: {
          serachName: ''
        },
        searchParams: {
          intention: "",
          dateType: "",
          startdate: '',
          enddate: '',
          pageSize: 15,
          pageIndex: 1,
          searchKey: ''
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
      this.getCustomerList();
    },
    methods: {
      getCustomerList() {
        openCustomerList(this.searchParams).then(res => {
          if (res.data.success) {
            this.txList = res.data.data.data;
          }
        })
      },
      //导入客户
      saveCustomer() {
        exportCustomerFun(this.customerInfo).then(res => {
          if (res.data.success) {
            this.showExportCustomer = false;
            this.getCustomerList();
            this.$message({
              showClose: true,
              message: "导入成功",
              type: "success"
            });
          }
        })
      },
      del() {
        let params = {
          name: '',
          puid: 'b53ab696c5bf4e069949124b79d1aba6',
        };
        delOpenCustomer(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "删除成功!",
              type: "success"
            });
            this.getCustomerList();
          }
        })
      },
      changeToMyCustomer() {
        let params = {
          puid: '35f355c9b7fe4d7cb5ca00c1055ae92f'
        };
        changeToMyCustomerFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "转入成功!",
              type: "success"
            });
            this.getCustomerList();
          }
        })
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
