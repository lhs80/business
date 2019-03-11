<template>
  <div class="app-container calendar-list-container classify-list">
    <!-- 商户分类 -->
    <div v-show="classifyListIsShow">
      <div class="classify-set-option">
        <div class="classify-edit-level">
          <el-button type="primary" size="small" @click="addClassify">添加商户分类</el-button>
        </div>
      </div>
      <el-table :data="typeList" stripe style="width: 100%">
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <i class="el-icon-edit" title="修改" @click="editClassify(scope.row)"></i>
            <i class="el-icon-delete" title="删除" @click="del(scope.row.cat_id)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="addClassifyIsShow">
      <el-form
        :model="typeInfo"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="排序" prop="sortIndex">
          <el-input v-model="typeInfo.sortIndex"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="typeInfo.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" v-show="type==='add'">添加</el-button>
          <el-button type="primary" @click="edit('ruleForm')" v-show="type==='edit'">修改</el-button>
          <el-button @click="closeBox">返回列表</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {adminShopTypeListFun, adminDelShopTypeFun, adminShopTypeAddOreditFun} from "@/api/activity"

  export default {
    data() {
      return {
        type: "",
        curType: {},
        typeList: [],
        classifyListIsShow: true,
        addClassifyIsShow: false,
        typeInfo: {
          id: "",
          sortIndex: "",
          name: ""
        },
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ]
        }
      };
    },
    mounted() {
      this.adminShopTypeList();
    },
    methods: {
      adminShopTypeList() {
        adminShopTypeListFun().then(res => {
          console.log("type", res);
          if (res.data.success) {
            this.typeList = res.data.data;
          }
        })
      },
      addClassify() {
        this.type = 'add';
        this.classifyListIsShow = false;
        this.addClassifyIsShow = true;
      },
      editClassify(item) {
        this.type = 'edit';
        this.typeInfo = {
          id: item.cat_id,
          sortIndex: item.sort_index,
          name: item.cat_name
        };
        this.classifyListIsShow = false;
        this.addClassifyIsShow = true;
      },
      closeBox() {
        this.classifyListIsShow = true;
        this.addClassifyIsShow = false;
        this.typeInfo={
          id: "",
          sortIndex: "",
          name: ""
        };
      },
      del(id) {
        let params = {
          id: id
        };
        adminDelShopTypeFun(params).then(res => {
          if (res.data.success) {
            ``
            this.adminShopTypeList();
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            adminShopTypeAddOreditFun(this.typeInfo).then(res => {
              if (res.data.success) {
                this.closeBox();
                this.adminShopTypeList();
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success"
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      edit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            adminShopTypeAddOreditFun(this.typeInfo).then(res => {
              if (res.data.success) {
                console.log("dd")
                this.typeInfo={
                  id: "",
                  sortIndex: "",
                  name: ""
                };
                this.$refs[formName].resetFields();
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                this.closeBox();
                this.adminShopTypeList();
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success"
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    }
  };
</script>
<style scoped>
  .classify-set-option {
    height: 55px;
  }
</style>
