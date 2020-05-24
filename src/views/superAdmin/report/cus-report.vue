<template>
  <div style="position:relative" class="app-container calendar-list-container client-list">
    <!--菜单栏-->
    <div class="bg-white text-right">
      <div style="width:200px;display:inline-block">
        <el-select v-model="searchParams.group_id" size="small" placeholder="请选择团队"
                   @change="(value)=>getAllUserByMch(value)">
          <el-option v-for="(item,index) in allTeamList"
                     :value="item.group_id"
                     :key="index"
                     :label="item.group_name"
          >
          </el-option>
        </el-select>
      </div>
      <div style="width:200px;display:inline-block">
        <el-select v-model="searchParams.salesManId" size="small" placeholder="请选择业务员">
          <el-option v-for="(item,index) in staffData"
                     :value="item.id"
                     :key="index"
                     :label="item.real_name"
          >
          </el-option>
        </el-select>
      </div>
      <label class="h6">是否代理：</label>
      <div style="width:200px;display:inline-block">
        <el-select v-model="searchParams.type" size="small" placeholder="是否代理">
          <el-option value="" label="全部"></el-option>
          <el-option value="代理" label="代理"></el-option>
          <el-option value="S" label="S"></el-option>
        </el-select>
      </div>
      <div style="width:200px;display:inline-block">
        <el-input size="small" placeholder="关键词用户姓名/手机号" v-model="searchParams.searchKey"></el-input>
      </div>
      <el-button size="small" type="primary" @click="businessReport">搜索</el-button>
      <el-button size="small" type="primary">
        <a
          :href="`http://m.gongjiangsht.com/mch/salesman/getCustomerReportExport?group_id=${searchParams.group_id || ''}&searchKey=${searchParams.searchKey || ''}&salesManId=${searchParams.salesManId || ''}&type=${searchParams.type || ''}&brand_id=${searchParams.brand_id || ''}`"
          target="_blank"
        >
          导出报表
        </a>
      </el-button>
    </div>
    <div class="mt2">
      <span class="h5" style="display:inline-block;width:50px">品 牌：</span>
      <span>
         <el-radio v-for="(item,index) in brandList"
                   v-model="searchParams.brand_id"
                   :label="item.poster_id" :key="index">{{item.poster_name}}</el-radio>
      </span>
    </div>
    <hr>
    <el-table :data="reportList" stripe style="width: 100%">
      <el-table-column prop="name" label="客户姓名" width="80"></el-table-column>
      <el-table-column prop="phone" label="客户电话" width="120"></el-table-column>
      <el-table-column prop="wechat" label="客户微信" width="140"></el-table-column>
      <el-table-column prop="address" label="客户地址" width="200"></el-table-column>
      <el-table-column prop="brand_names" label="品牌"></el-table-column>
      <el-table-column prop="type" label="是否代理" width="50"></el-table-column>
      <el-table-column prop="order_money_count" label="代理区域">
        <template slot-scope="scope">
          {{scope.row.agent_provice}}{{scope.row.agent_city}}{{scope.row.agent_county}}
        </template>
      </el-table-column>
      <el-table-column prop="spend_count" label="订单数"></el-table-column>
      <el-table-column prop="spend_money" label="订单金额"></el-table-column>
      <el-table-column prop="group_name" label="归属团队"></el-table-column>
      <el-table-column prop="salesMan_name" label="归属业务员"></el-table-column>
      <el-table-column label="详情">
        <template slot-scope="scope">
          <router-link :to="{path: '/superAdmin/followList/detail',query:{id:scope.row.id,type:2}}">
            <span class="text-info">详情</span>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt2 text-right">
      <el-pagination
        :page-sizes="paginations.pageSizes"
        :page-size="paginations.page_size"
        :layout="paginations.layout"
        :total="paginations.total"
        :current-page="paginations.page_index"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
  import {
    customerListFun,
    teamsListFun,
    getAllUserByMchFun,
    postListFun
  } from '@/api/activity'

  export default {
    data() {
      return {
        activeName: 'first',
        searchParams: {},
        teamList: [],
        allTeamList: [],
        reportList: [],
        staffData: [],
        brandList: [],
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        },
      }
    },
    watch: {
      searchParams: {
        handler() {
          this.paginations.page_index = 1;
          this.businessReport();
        },
        deep: true,
      },
    },
    mounted() {
      this.getAllTeams();
      this.businessReport();
      this.queryBrandList()
    },
    methods: {
      queryBrandList() {
        let params = {
          pageSize: 1000,
          pageIndex: 1
        };
        postListFun(params).then(res => {
          console.log("brand", res);
          if (res.data.success) {
            this.brandList = res.data.data.data;
          }
        })
      },
      //团队列表
      getAllTeams() {
        teamsListFun().then(res => {
          if (res.data.success) {
            this.allTeamList = res.data.data;
          }
        })
      },
      /** 业务员列表 */
      getAllUserByMch(groupId) {
        let params = {
          group_id: groupId
        };
        getAllUserByMchFun(params).then(res => {
          console.log('staff', res);
          if (res.data.success) {
            this.staffData = res.data.data;
          }
        })
      },
      //客户报表
      businessReport() {
        let params = {
          ...this.searchParams,
          pageSize: this.paginations.page_size,
          pageIndex: this.paginations.page_index
        };
        customerListFun(params).then(res => {
          if (res.data.success) {
            this.reportList = res.data.data.data;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page
        this.businessReport()
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size
        this.businessReport()
      },
    }
  }
</script>
