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
        
      </el-tab-pane>
      <el-tab-pane label="客户订单" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="客户交易" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="跟进动态" name="fourth">定时任务补偿</el-tab-pane>
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
