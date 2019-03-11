<template>
  <div class="app-container calendar-list-container client-list">
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
        <el-button size="small" type="primary" @click="salesStatistics">搜索</el-button>
      </div>
    </div>
    <div class="bg-grey p1">
      <span>交易额：{{totalPrice}}元</span>
      <span class="prl1">最高交易额：{{maxPrice.total_money}}元({{maxPrice.sdate}})</span>
    </div>
    <el-table :data="saleDate" stripe style="width: 100%">
      <el-table-column prop="sdate" label="月份" width="180"></el-table-column>
      <el-table-column prop="total_money" label="交易额"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {salesStatisticsFun} from "@/api/activity"

  export default {
    name: "xiaoShouPage",
    data() {
      return {
        totalPrice:0,
        maxPrice: {total_money: 0, sdate: ""},
        saleDate: [],
        month: [],
        years: [],
        searchCondition: {
          year: "",
          month: ""
        }
      };
    },
    mounted() {
      this.getMonth();
      this.getYears();
      this.salesStatistics();
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
      salesStatistics() {
        salesStatisticsFun(this.searchCondition).then(res => {
          if (res.data.success) {
            this.saleDate = res.data.data;
            this.saleDate.forEach((item, index) => {
              this.totalPrice += item.total_money;
              if (item.total_money > this.maxPrice.total_money) {
                this.maxPrice = item;
              }
            })
          }
        })
      }
    }
  };
</script>
<style scoped>
  .sale-set-option {
    height: 55px;
    text-align: right;
  }
</style>
