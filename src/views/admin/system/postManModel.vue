<template>
  <div class="app-container calendar-list-container client-list">
    <el-row>
      <el-col :span="6">
        <el-button type="primary" size="small" @click="$router.push({path:'/admin/postMan/add'})">添加发件人模板</el-button>
      </el-col>
      <el-col :span="18" class="text-right">
        <div class="staff-filtration-btn">
          <el-select v-model="searchCondition.is_payroll" size="small" style="width:150px;" placeholder="请选择">
            <el-option label="在职" value="1"></el-option>
            <el-option label="离职" value="0"></el-option>
          </el-select>
        </div>
        <div class="staff-filtration-btn">
          <el-select v-model="searchCondition.group_id" size="small" placeholder="请选择">
            <el-option
              v-for="(item,index) in groupList"
              :key="index"
              :label="item.group_name"
              :value="item.group_id"
            ></el-option>
          </el-select>
        </div>
        <div class="staff-filtration-btn">
          <el-input v-model="searchCondition.name" placeholder="姓名/手机号" size="small"></el-input>
        </div>
        <el-button type="primary" size="small" @click="getAllUserByMch">查询</el-button>
      </el-col>
    </el-row>
    <el-table :data="staffData" stripe style="width: 100%" class="mt2" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="姓名/用户名">
        <template slot-scope="scope">
          <h6>{{scope.row.real_name}}</h6>
          <h6>{{scope.row.phone}}</h6>
        </template>
      </el-table-column>
      <el-table-column prop="role_name" label="权限身份"></el-table-column>
      <el-table-column prop="group_name" label="分组"></el-table-column>
      <el-table-column prop="is_payroll" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_payroll===1">在职</el-tag>
          <el-tag type="info" v-else>离职</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" v-if="scope.row.is_admin!==1">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <i class="el-icon-edit" @click="$router.push({path:'/admin/sheet/edit',query:{id:scope.$index}})"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="el-icon-delete" @click="showConfirmDialog(scope.row.id)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--修改分组弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;"
         v-show="isShowEditLevel">
      <div class="el-message-box el-message-box--center">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">批量修改分组</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowEditLevel=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-form ref="form" label-width="80px" class="mt2">
            <el-form-item label="客户等级">
              <el-select v-model="selGroupId" placeholder="请选择等级">
                <el-option v-for="(item,index) in groupList" :label="item.group_name" :value="item.group_id"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="text-left">
              <el-button type="primary" @click="onSubmit">立即修改</el-button>
              <el-button type="primary" @click="isShowEditLevel=false">关闭</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowEditLevel"></div>
  </div>
</template>
<script>
  import {getAllUserByMchFun, getAllUserGroupFun, delMerchantUserFun, changeEmployeeGroupFun} from "@/api/activity"

  export default {
    name: "staffPage",
    data() {
      return {
        multipleSelection: "",
        isShowEditLevel: false,
        searchName: "",
        staffData: [],
        groupList: [],
        selGroupId: "",
        searchCondition: {
          is_payroll: "",
          name: "",
          group_id: ""
        }
      };
    },
    mounted() {
      this.getAllUserByMch();
      this.getAllUserGroup();
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      wantToChangeType() {
        if (this.multipleSelection.length)
          this.isShowEditLevel = true;
        else
          this.$message({
            showClose: true,
            message: "请先选择员工",
            type: "success"
          });
      },
      //修改等级
      editLevel() {
        if (this.multipleSelection && this.multipleSelection.length) {
          this.isShowEditLevel = true;
        } else {
          this.$message({
            message: '请选择要修改等级的客户！',
            type: 'warning',
            center: true
          });
        }
      },
      /**
       *所有员工分组
       */
      getAllUserGroup() {
        getAllUserGroupFun().then(res => {
          if (res.data.success) {
            this.groupList = res.data.data;
          }
        })
      },
      /**
       *所有员工
       */
      getAllUserByMch() {
        getAllUserByMchFun(this.searchCondition).then(res => {
          console.log("employee", res);
          if (res.data.success) {
            this.staffData = res.data.data;
          }
        })
      },
      showConfirmDialog(id) {
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
       *删除员工
       */
      delMerchantUser(userId) {
        console.log(userId);
        let params = {
          user_id: userId
        };
        delMerchantUserFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              center: true
            });
            this.getAllUserByMch();
          }
        })
      },
      onSubmit() {
        let uids = "";
        this.multipleSelection.forEach((item, index) => {
          uids += item.id + ",";
        });
        let params = {
          group_id: this.selGroupId,
          user_id: uids,
        };
        changeEmployeeGroupFun(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "修改等级成功",
              type: "success",
              center: true
            });
            this.isShowEditLevel = false;
            this.getAllUserByMch();
          }
        })
      }
    }
  };
</script>
<style scoped>
  .staff-filtration-btn {
    display: inline-block;
    max-width: 150px;
    margin-right: 5px;
  }
</style>
