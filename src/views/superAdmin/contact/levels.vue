<template>
  <div class="app-container calendar-list-container level-list">
    <!-- 商户等级 -->
    <div v-show="levelListIsShow">
      <div class="level-set-option">
        <div class="level-edit-level">
          <el-button type="primary" size="small" @click="addLevel">添加商户等级</el-button>
        </div>
      </div>
      <el-table :data="levelList" stripe style="width: 100%">
        <el-table-column prop="level_name" label="商户等级名称"></el-table-column>
        <el-table-column prop="is_defult" label="是否默认">
          <template slot-scope="scope">
            {{scope.row.is_defult===1?"是":"否"}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <i class="el-icon-edit" title="修改" @click="editLevel(scope.row)"></i>
            <i class="el-icon-delete" title="删除" @click="del(scope.row.level_id)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--新增-->
    <div v-show="addLevelIsShow">
      <el-form
        :model="levelInfo"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="商户等级名称" prop="name">
          <el-input v-model="levelInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品免审核" prop="isAutoAduit">
          <el-radio-group v-model="levelInfo.isAutoAduit">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否默认等级" prop="isDefult">
          <el-radio :label="1" v-model="levelInfo.isDefult">是</el-radio>
          <el-radio :label="0" v-model="levelInfo.isDefult">否</el-radio>
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
  import {adminShopLevelListFun, adminDelShopLevelFun, adminAddOrEditLevelFun} from "@/api/activity"

  export default {
    data() {
      return {
        type: "",
        levelList: [],
        levelInfo: {
          id:'',
          name: "",
          isAutoAduit: "",
          isDefult: "0"
        },
        levelListIsShow: true,
        addLevelIsShow: false,
        editLevelIsShow: false,
        ruleForm: {
          name: '',
          mian: '',
          moren: '',
        },
        rules: {
          name: [
            {required: true, message: "请输入商品名称", trigger: "blur"},
            {min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur"}
          ],
          level_name: [
            {required: true, message: "请输入商品名称", trigger: "blur"},
            {min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur"}
          ],
          isAutoAduit: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          isDefult: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
        }
      };
    },
    mounted() {
      this.getLevelList();
    },
    methods: {
      getLevelList() {
        adminShopLevelListFun().then(res => {
          console.log("level", res);
          if (res.data.success) {
            this.levelList = res.data.data;
          }
        })
      },
      del(id) {
        let params = {
          id: id
        };
        adminDelShopLevelFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
            this.getLevelList();
          }
        })
      },
      addLevel() {
        this.type="add";
        this.levelListIsShow = false;
        this.addLevelIsShow = true;
      },
      editLevel(item) {
        console.log(item);
        this.type="edit";
        this.levelInfo = {
          id:item.level_id,
          name: item.level_name,
          isAutoAduit: item.is_auto_aduit,
          isDefult: item.is_defult
        };
        this.levelListIsShow = false;
        this.addLevelIsShow = true;
      },
      closeBox() {
        this.levelListIsShow = true;
        this.addLevelIsShow = false;
        this.levelInfo={
          name: "",
          isAutoAduit: "",
          isDefult: "0"
        };
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            adminAddOrEditLevelFun(this.levelInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  type: "success"
                });
                this.closeBox();
                this.getLevelList();
              } else {
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
            adminAddOrEditLevelFun(this.levelInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                this.closeBox();
                this.getLevelList();
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
  .level-set-option {
    height: 55px;
  }
</style>
