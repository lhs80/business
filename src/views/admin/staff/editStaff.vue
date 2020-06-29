<template>
  <div class="app-container calendar-list-container addStaff-list">
    <div class="addStaff-set-option"></div>
    <el-form :model="employeeInfo" :rules="rules" ref="employeeInfo" label-width="100px">
      <el-form-item label="用户名" prop="phone">
        {{employeeInfo.phone}}
      </el-form-item>
      <el-form-item label="姓名">
        <el-input type="text" v-model="employeeInfo.real_name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="employeeInfo.is_payroll" label="1">在职</el-radio>
        <el-radio v-model="employeeInfo.is_payroll" label="0">离职</el-radio>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="employeeInfo.pwd" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="dPassword">
        <el-input type="password" v-model="employeeInfo.dPassword" placeholder="请再次输入密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属用户组" prop="role_id">
        <el-select v-model="employeeInfo.role_id" placeholder="请选择用户组">
          <el-option label="业务员" value="3"></el-option>
          <el-option label="仓库管理员" value="4"></el-option>
          <el-option label="财务" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团队" prop="group_id">
        <el-select v-model="employeeInfo.group_id" placeholder="请选择团队">
          <el-option
            v-for="(item,index) in groupList"
            :key="index"
            :label="item.group_name"
            :value="item.group_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('employeeInfo')">提交</el-button>
        <el-button type="primary" @click="$router.push('/admin/staffList')" plain>返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {updateUserFun, getAllUserGroupFun, getAllUserByMchFun} from "@/api/activity"

  export default {
    data() {
      return {
        groupList: [],
        employeeInfo: {
          phone: '',
          pwd: '',
          dPassword: '',
          is_payroll: "",
          role_id: '',
          group_id: '',
          user_id: ""
        },
        rules: {
          pwd: [
            {min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur'}
          ],
          dPassword: [
            {validator: this.validatePass, trigger: 'blur'}
          ],
          role_id: [
            {required: true, message: '请选择分组', trigger: 'change'}
          ],
          group_id: [
            {required: true, message: '请选择团队', trigger: 'change'}
          ]
        }
      };
    },
    mounted() {
      this.getAllUserByMch();
      this.getAllUserGroup();
    },
    methods: {
      /**
       *所有员工
       */
      getAllUserByMch() {
        getAllUserByMchFun().then(res => {
          console.log(res.data.data[this.$route.query.id]);
          if (res.data.success) {
            this.employeeInfo = {
              phone: res.data.data[this.$route.query.id].phone,
              real_name: res.data.data[this.$route.query.id].real_name,
              is_payroll: res.data.data[this.$route.query.id].is_payroll.toString(),
              role_id: res.data.data[this.$route.query.id].role_id.toString(),
              group_id: res.data.data[this.$route.query.id].group_id,
              user_id: res.data.data[this.$route.query.id].id,
            }
          }
        })
      },
      validatePass(rule, value, callback) {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.employeeInfo.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      /**
       * 所有员工分组
       */
      getAllUserGroup() {
        getAllUserGroupFun().then(res => {
          if (res.data.success) {
            this.groupList = res.data.data;
          }
        })
      },
      /**
       * 修改员工信息
       */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log(this.employeeInfo);
            updateUserFun(this.employeeInfo).then(res => {
              console.log(res);
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success",
                  center: true
                });
              }
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
    }
  };
</script>
<style scoped>
  .addStaff-set-option {
    height: 55px;
  }
</style>
