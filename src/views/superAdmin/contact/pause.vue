<template>
   <div class="app-container calendar-list-container pause-list">
    <div class="pause-set-option">
      <div class="pause-filter"><el-input placeholder="请输入内容" style="width:200px;height:32px !important;"  v-model="searchKey">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input></div>
    </div>
    <!-- 暂停中 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="商户ID" width="180"></el-table-column>
      <el-table-column prop="name" label="商户名称" width="180"></el-table-column>
      <el-table-column prop="project" label="主营项目"></el-table-column>
      <el-table-column prop="linkMan" label="联系人"></el-table-column>
      <el-table-column prop="time" label="入驻时间"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column prop="revenue" label="营收"></el-table-column>
      <el-table-column  label="操作"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
    data() {
      return {
        tableData: [{
          id:"1",  
          time: '2016-05-02',
          name: '王小虎',
          project:'fhgg',
          linkMan:'dd',
          state: '已入住',
          revenue:'2849'
        }, {
          id:"2",  
          time: '2016-05-02',
          name: '王小虎',
          project:'fhgg',
          linkMan:'dd',
          state: '已入住',
          revenue:'2849'
        }, {
          id:"3",  
          time: '2016-05-02',
          name: '王小虎',
          project:'fhgg',
          linkMan:'dd',
          state: '已入住',
          revenue:'2849'
        }, {
         id:"4",  
          time: '2016-05-02',
          name: '王小虎',
          project:'fhgg',
          linkMan:'dd',
          state: '已入住',
          revenue:'2849'
        }]
      }
    }
};
</script>
<style scoped>
.pause-set-option{
    height: 55px;
}
.pause-filter{
    width: 30%;
}
</style>
