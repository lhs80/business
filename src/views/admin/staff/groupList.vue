<template>
  <section class="app-container calendar-list-container client-list">
    <div class="client-set-option">
      <el-button type="primary" size="small" @click="showAddGroup=true">添加分组</el-button>
    </div>
    <el-table :data="groupList" stripe style="width: 100%">
      <el-table-column prop="group_name" label="分组名称" width="180"></el-table-column>
      <el-table-column prop="user_count" label="人数"></el-table-column>
      <el-table-column prop="group_desc" label="分组描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="成员" placement="top-start">
            <i class="el-icon-tickets" @click="getAllUserByMch(scope.row.group_id)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="el-icon-delete" @click="showConfirmDialog(scope.row.group_id)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--新增分组弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="showAddGroup">
      <div class="el-message-box el-message-box--center">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">添加分组</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="showAddGroup=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-form :model="groupInfo" :rules="rules" ref="employeeInfo" label-width="100px">
            <el-form-item label="分组名称" prop="group_name">
              <el-input v-model="groupInfo.group_name" placeholder="分组名称"></el-input>
            </el-form-item>
            <el-form-item label="分组描述">
              <el-input type="textarea" v-model="groupInfo.group_desc" placeholder="分组描述"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-message-box__btns">
          <el-button type="primary" @click="submitForm('employeeInfo')">立即创建</el-button>
          <el-button type="info" @click="showAddGroup=false">关闭</el-button>
        </div>
      </div>
    </div>
    <!--组成员弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="showGroupMember">
      <div class="el-message-box el-message-box--center" style="width:40%">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">查看组成员</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="showGroupMember=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content" style="height:300px;overflow-y:auto">
          <el-table :data="staffData" stripe style="width: 100%" class="mt2">
            <el-table-column prop="name" label="姓名/用户名">
              <template slot-scope="scope">
                <h6>{{scope.row.real_name}}</h6>
                <h6>{{scope.row.phone}}</h6>
              </template>
            </el-table-column>
            <el-table-column prop="role_name" label="权限身份"></el-table-column>
            <el-table-column prop="group_name" label="分组"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope" v-if="scope.row.is_admin!==1">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <i class="el-icon-edit" @click="$router.push({path:'/staff/editstaff',query:{id:scope.$index}})"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <i class="el-icon-delete" @click="showDelMemberConfirmDialog(scope.row.id)"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="showGroupMember=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="showAddGroup||showGroupMember"></div>
  </section>
</template>
<script>
  import {
    getAllUserGroupFun,
    makeUserGroupFun,
    delUserGroupFuns,
    getAllUserByMchFun,
    delMerchantUserFun,
    delMerchantUserFromGroupFun
  } from "@/api/activity"

  export default {
    name: "groupList",
    data() {
      return {
        showAddGroup: false,
        showGroupMember: false,
        groupInfo: {
          group_name: "",
          group_desc: ""
        },
        groupList: [],
        staffData: [],
        rules: {
          group_name: [
            {required: true, message: '请输入分组名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
        }
      };
    },
    mounted() {
      this.getAllUserGroup()
    },
    methods: {
      /**
       *组成员
       */
      getAllUserByMch(groupId) {
        let params = {
          group_id: groupId
        };
        getAllUserByMchFun(params).then(res => {
          console.log("staff", res);
          if (res.data.success) {
            this.staffData = res.data.data;
            this.showGroupMember = true;
          }
        })
      },
      /**
       *所有员工分组
       */
      getAllUserGroup() {
        getAllUserGroupFun().then(res => {
          console.log("group", res)
          if (res.data.success) {
            this.groupList = res.data.data;
          }
        })
      },
      /**
       * 新增分组
       */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            makeUserGroupFun(this.groupInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "新增分组成功",
                  type: "success",
                  center: true
                });
                this.showAddGroup = false
                this.getAllUserGroup();
              }
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      /**
       * 删除分组确认弹框
       */
      showConfirmDialog(id) {
        this.$confirm('确认删除该分组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delUserGroup(id);
        }).catch(() => {
        });
      },
      /**
       * 删除分组
       */
      delUserGroup(id) {
        let params = {
          group_id: id
        };
        delUserGroupFuns(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "删除分组成功",
              type: "success",
              center: true
            });
            this.getAllUserGroup();
          }
        })
      },
      /**
       * 删除员工确认弹框
       */
      showDelMemberConfirmDialog(id) {
        this.$confirm('确认删除该员工吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delMerchantUser(id);
        }).catch(() => {
        });
      },
      /**
       *从分组中删除员工
       */
      delMerchantUser(userId) {
        console.log(userId);
        let params = {
          user_id: userId
        };
        delMerchantUserFromGroupFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              center: true
            });
            this.showGroupMember = false;
          }
        })
      }
    }
  };
</script>
<style scoped>
</style>
