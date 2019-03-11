<template>
  <div class="app-container calendar-list-container order-list">
    <el-table
      :data="consume"
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="mu_id" label="排序">
        <template slot-scope="scope">
          <h6 class="sortNum" :class="{'topFlag':scope.$index<=3}">{{scope.$index+1}}</h6>
        </template>
      </el-table-column>
      <el-table-column prop="nick_name" label="客户" sortable></el-table-column>
      <el-table-column prop="real_name" label="姓名" sortable></el-table-column>
      <el-table-column prop="level_id" label="等级" sortable></el-table-column>
      <el-table-column prop="spend_count" label="订单数" sortable></el-table-column>
      <el-table-column prop="spend_money" label="消费金额"></el-table-column>
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
      class="text-right mt2"
    ></el-pagination>
  </div>
</template>
<script>
  import {adminShopCountFun} from "@/api/activity"

  export default {
    name: "xiaoFeiPage",
    data() {
      return {
        consume: [],
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        }
      };
    },
    mounted() {
      this.xfRank();
    },
    methods: {
      xfRank() {
        adminShopCountFun().then(res => {
          if (res.data.success) {
            console.log(res);
            this.consume = res.data.data.data;
            this.paginations.page_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        })
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.xfRank();
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.xfRank()
      },
    }
  };
</script>
<style scoped>
  .topFlag {
    background: #eb6060 !important
  }

  .sortNum {
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: white;
    text-align: center;
    background: #ccc;
  }
</style>
