<template>
  <div class="app-container calendar-list-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="分类链接">
        <el-input v-model="ruleForm.link" disabled></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="ruleForm.sort_index"></el-input>
      </el-form-item>
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="ruleForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="$router.push('/admin/classify')">返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {addOrEditGoodsCat} from "@/api/activity"

  export default {
    data() {
      return {
        ruleForm: {
          cat_name: '',
          link: "",
          cat_id: '',
          sort_index: '',
        },
        rules: {
          cat_name: [
            {required: true, message: "请输入分类名称", trigger: "blur"},
            {min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              id: this.ruleForm.cat_id,
              name: this.ruleForm.cat_name,
              sortIndex: this.ruleForm.sort_index
            };
            addOrEditGoodsCat(params).then(res => {
              if (res.data.success) {
                this.$message({
                  message: '添加分类成功！',
                  type: 'success',
                  center: true
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'success',
                  center: true
                });
              }
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    }
  };
</script>
