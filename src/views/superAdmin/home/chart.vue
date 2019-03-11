<template>
  <div class="app-container calendar-list-container chart-page">
    <div class="card-box">
        <div>
            <p>今日成交</p>
            <div>$1212112</div>
            <p><span style="margin-right: 16px;">订单</span>124</p>
        </div>
        <div>
            <p>昨日成交1</p>
            <div>$1212112</div>
            <p><span style="margin-right: 16px;">订单</span>124</p>
        </div>
        <div>
            <p>近七日成交</p>
            <div>$1212112</div>
            <p><span style="margin-right: 16px;">订单</span>124</p>
        </div>
        <div>
            <p>近一月成交</p>
            <div>$1212112</div>
            <p><span style="margin-right: 16px;">订单</span>124</p>
        </div>
    </div>

    <div id="myChart" :style="{width: '600px', height: '500px',display:'inline-block'}"></div>
    <div class="sale-list">
        <p>商品销售额排名</p>
        <ul class="poi-list-ul">
        <li v-for="(item,index) in list" :key="index" >
          <div class="list-num" v-bind:class="{numColor: item.id>3}">{{item.id}}</div>
          <div class="list-name" >{{item.name}}</div>
          <div class="list-count" >{{item.count}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "hello",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      list:[{
          id:1,
          name:"大家好的几个",
          count:"12456"
      },
      {
          id:2,
          name:"大家好的几个",
          count:"12456"
      },
      {
          id:3,
          name:"大家好的几个",
          count:"12456"
      },
      {
          id:4,
          name:"大家好的几个",
          count:"12456"
      }]
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: "在Vue中使用echarts" },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    }
  }
};
</script>
<style scoped>
.chart-page{
    background-color: #F0F2F5;
}
.card-box {
  width: 100%;
  height: 160px;
  border: 1px solid black;
}
.card-box > div{
    display: inline-block;
    width: 240px;
    height: 150px;
    margin-left:10px;
    margin-right: 10px; 
   background-color: white;
   border-radius: 5px;
    overflow: hidden;
}
.card-box>div>p{
    padding: 10px;
    color: gray;
    font-size: 12px;
}
.card-box>div>div{
   padding-left: 10px;
    font-size: 24px;
    font-weight: bold;
    border-bottom: 1px solid gainsboro;
    padding-bottom: 10px;
}
.sale-list{
    display: inline-block;
    width: 300px;
    height: 500px;
    overflow-y: auto;
    background-color: white;
}
.list-num{
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50%;
    background-color: #314659;
    text-align: center;
    line-height: 20px;
    vertical-align: middle;
    color: white;
}
.list-name{
    display: inline-block;
    width: 210px;
    overflow: hidden;
    vertical-align: middle;
}
.list-count{
    display: inline-block;
    width: 60px;
    vertical-align: middle; 
}
.numColor{
    background-color: white !important;
    color: black !important;
}
</style>

