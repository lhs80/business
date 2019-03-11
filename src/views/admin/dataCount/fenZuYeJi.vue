<template>
  <div class="app-container calendar-list-container order-list">
    <div class="sale-set-option">
      <div style="width:200px;display:inline-block;">
        <el-select size="small" v-model="searchCondition.year" placeholder="年">
          <el-option
            v-for="item in years"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="width:200px;display:inline-block;">
        <el-select size="small" v-model="searchCondition.month" placeholder="月份">
          <el-option
            v-for="item in month"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="display:inline-block;">
        <el-button size="small" type="primary" @click="salesRank">搜索</el-button>
      </div>
    </div>
    <el-table :data="consume" style="width: 100%">
      <el-table-column prop="salesman_id" label="排序">
        <template slot-scope="scope">
          <h6 class="sortNum" :class="{'topFlag':scope.$index<=3}">{{scope.$index+1}}</h6>
        </template>
      </el-table-column>
      <el-table-column prop="group_name" label="分组名称"></el-table-column>
      <el-table-column prop="group_c" label="成员人数"></el-table-column>
      <el-table-column prop="total_c" label="订单数"></el-table-column>
      <el-table-column prop="total" label="业绩金额"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {salesGroupRankFun} from "@/api/activity"

  export default {
    name: "xiaoFeiPage",
    data() {
      return {
        consume: [],
        month: [],
        years: [],
        searchCondition: {
          year: "",
          month: ""
        },
      };
    },
    mounted() {
      this.getMonth();
      this.getYears();
      this.salesRank();
    },
    methods: {
      getYears() {
        let yearStart = new Date();
        for (let i = yearStart.getFullYear() - 1; i < yearStart.getFullYear() + 1; i++) {
          this.years.push({
            label: i + "年",
            value: i
          });
        }
      },
      getMonth() {
        for (let i = 1; i <= 12; i++) {
          this.month.push({
            label: i + "月",
            value: i
          });
        }
      },
      salesRank() {
        salesGroupRankFun(this.searchCondition).then(res => {
          if (res.data.success) {
            console.log(res);
            this.consume = res.data.data;
          }
        })
      },
    }
  };
</script>
<style scoped>
  .topFlag {
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: white;
    text-align: center;
    background: #eb6060 !important
  }

  .sale-set-option {
    height: 55px;
    text-align: right;
  }
</style>

