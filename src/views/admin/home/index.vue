<template>
  <div class="app-container calendar-list-container chart-page">
    <el-row :gutter="20">
      <el-col :span="6"  v-if="index<4" v-for="(item,index) in list" :key="index">
        <div class="data-card">
          <h4 class="text-muted">{{item.desc}}</h4>
          <h2>￥{{item.total}}</h2>
          <h3 class="text-muted">订单 <span class="prl1">{{item.c}}</span></h3>
        </div>
      </el-col>
    </el-row>

    <el-row class="bg-white mt2 p2">
      <el-col :span="18">
        <div id="myChart" :style="{width: '100%', height: '500px',display:'inline-block'}"></div>
      </el-col>
      <el-col :span="6">
        <h2>商品销售额排名</h2>
        <el-row v-for="(item,index) in consume" :key="index" type="flex" align="middle" v-if="index<10">
          <el-col class="text-center" :span="4"><span class="defaultFlag" :class="{topFlat: (index+1)<3}">{{index+1}}</span></el-col>
          <el-col class="text-muted h6" :span="14">{{item.goods_name}}</el-col>
          <el-col class="text-muted h6 text-right prl1" :span="6">{{item.sales_money}}</el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {shopIndexDataFun, goodsSalesRankFun, salesStatisticsFun} from "@/api/activity"

  export default {
    name: "hello",
    data() {
      return {
        list: [],
        consume: [],
        xAxis: [],
        series: [],
      };
    },
    mounted() {
      this.getData();
      this.xfRank();
      this.salesStatistics();
    },
    methods: {
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById("myChart"));
        // 绘制图表
        myChart.setOption({
          title: {text: "销售额"},
          tooltip: {},
          xAxis: {
            data: this.xAxis,
          },
          yAxis: {},
          series: [
            {
              name: "销量",
              type: "bar",
              data: this.series,
              barWidth: 50,
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: "#3ba1ff"
                }
              },
            }
          ]
        });
      },
      getData() {
        shopIndexDataFun().then(res => {
          if (res.data.success) {
            this.list = res.data.data;
          }
        })
      },
      xfRank() {
        goodsSalesRankFun().then(res => {
          if (res.data.success) {
            this.consume = res.data.data;
          }
        })
      },
      salesStatistics() {
        salesStatisticsFun().then(res => {
          if (res.data.success) {
            res.data.data.forEach((item, index) => {
              this.xAxis.push(item.sdate);
              this.series.push(item.total_money)
            });
            this.drawLine();
          }
        })
      }
    }
  };
</script>
<style scoped>
  .chart-page {
    background-color: #f0f2f5;
  }

  .data-card {
    background: white;
    padding: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .data-card h1 {
    font-size: 40px;
    border-bottom: solid 1px #e5e5e5;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }

  .data-card:nth-child(2n) {
    margin-left: 4%;
  }

  .data-card:nth-child(n+3) {
    margin-top: 4%;
  }

  .card-box {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-align: center;
    -webkit-box-pack: center;
    width: 50%;
    float: left;
    height: 225px;
    background: white;
  }

  .card-box:nth-child(-n+2) {
    border-bottom: solid 1px #e5e5e5;
  }

  .card-box:nth-child(2n-1) {
    position: relative;
  }

  .card-box:nth-child(2n-1):after {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 1px;
    height: 60%;
    background: #e5e5e5;
  }

  .defaultFlag{
    display: inline-block;
    border-radius: 100px;
    width: 20px;
    height: 20px;
    line-height:20px;
    color: white !important;
    font-size:14px;
    background-color: #e5e5e5 !important;
    vertical-align:middle
  }
  .topFlat {
    background-color: #eb6060 !important;
  }
</style>

