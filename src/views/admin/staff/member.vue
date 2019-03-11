<template>
  <div class="app-container calendar-list-container member-list">
    <div class="member-set-option"></div>
     <el-table :data="memberList" stripe style="width: 100%">
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
       <el-table-column prop="rule" label="权限身份"></el-table-column>
       <el-table-column prop="group" label="分组"></el-table-column>
        <el-table-column  label="操作">
            <i @click="member" class="el-icon-edit"></i>
            <i class="el-icon-delete"></i>
        </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
        memberList:[
            {
                name:'王晓红',
                userName:'技术员',
                rule:'财务',
                group:'分组1'
            },
             {
                name:'王晓红',
                userName:'技术员',
                rule:'财务',
                group:'分组1'
            },
             {
                name:'王晓红',
                userName:'技术员',
                rule:'财务',
                group:'分组1'
            }

        ]
    };
  }
};
</script>
<style scoped>
</style>
