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
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="isAdd">立即创建</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" v-else>立即更新</el-button>
        <el-button @click="backClassify">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {addOrEditGoodsCat} from "@/api/activity"

  export default {
    props: {
      curEditItem: {
        type: Object,
        default: null
      },
      isAdd: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        ruleForm: {
          cat_name: this.childItem ? this.childItem.cat_name : '',
          link: "",
          cat_id: this.childItem ? this.childItem.cat_id : '',
          sort_index: this.childItem ? this.childItem.sort_index : '',
        },
        rules: {
          cat_name: [
            {required: true, message: "请输入分类名称", trigger: "blur"},
            {min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur"}
          ]
        }
      };
    },
    watch: {
      curEditItem(val, oldVal) {
        this.ruleForm = val;
        console.log(this.ruleForm)
      }
    },
    methods: {
      //取消
      backClassify() {
        this.$emit("back", 'true');
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let _this = this;
            let params = {
              id: this.ruleForm.cat_id,
              name: this.ruleForm.cat_name,
              sortIndex: this.ruleForm.sort_index
            };
            addOrEditGoodsCat(params).then(res => {
              console.log("add", res);
              if (res.data.success) {
                this.$message({
                  message: this.isAdd ? '添加分类成功！' : "更新分类成功！",
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
