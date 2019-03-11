<template>
  <div class="app-container calendar-list-container">
    <div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分组名称">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="选择商品" prop="name">
         <el-button type="primary" @click="addCommidy">选择商品</el-button>
         
        </el-form-item>
        <el-form-item label="缩列图" prop="name">
          <el-button type="primary">选择图片</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="backClassify">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        textarea3:"",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods:{
      backClassify(){
          this.$emit("closeGroup");
      }
      
  }
};
</script>
<style scoped>
</style>
