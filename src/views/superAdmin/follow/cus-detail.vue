<template>
  <section class="p2">
    <el-row>
      <el-col :span="12">
        <div>客户姓名：张三 跟进人：磊</div>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button type="primary" size="small" @click="showExportCustomer=true">添加订单</el-button>
        <el-button type="primary" size="small" @click="">转移至客户公海</el-button>
        <el-button type="danger" size="small" @click="passCheck()">删除</el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本资料" name="first">
        <ul>
          <li>姓名：</li>
          <li>电话：</li>
          <li>地址：</li>
          <li>品牌：</li>
          <li>微信：</li>
          <li>类型：</li>
          <li>创建时间：</li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="客户订单" name="second">
        <el-table>
          <el-table-column label="商品名称"></el-table-column>
          <el-table-column label="订单金额"></el-table-column>
          <el-table-column label="创建日期"></el-table-column>
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
  export default {
    data() {
      return {
        activeName: 'first'
      }
    }
  }
</script>

<style scoped>

</style>
