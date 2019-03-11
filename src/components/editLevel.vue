<template>
  <div class="editLevel-list">
    <h2>批量修改客户等级</h2>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="客户等级">
        <el-select v-model="form.level" placeholder="请选择等级">
          <el-option label="普通客户" value="putong"></el-option>
          <el-option label="高级客户" value="gaoji"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="backKeHu">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
        form: {
          level: ''
        }
    };
  },
  methods:{
      backKeHu(){
        this.$emit("back","true");  
      },
      onSubmit(){
          console.log("dd");
      }
  }
};
</script>
<style scoped>
.editLevel-list{
    width: 30%;
    margin-top:80px;
    margin-left:40%;
}
</style>
