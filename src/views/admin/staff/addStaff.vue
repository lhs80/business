<template>
  <div class="app-container calendar-list-container addStaff-list">
    <div class="addStaff-set-option"></div>
    <el-form :model="employeeInfo" :rules="rules" ref="employeeInfo" label-width="100px">
      <el-form-item label="账号" prop="phone">
        <el-input v-model="employeeInfo.phone" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input type="password" v-model="employeeInfo.pwd" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="dPassword">
        <el-input type="password" v-model="employeeInfo.dPassword" placeholder="请再次输入密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="real_name">
        <el-input v-model="employeeInfo.real_name" placeholder="您的真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="employeeInfo.sex" placeholder="性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属用户组" prop="role_id">
        <el-select v-model="employeeInfo.role_id" placeholder="请选择用户组">
          <el-option label="业务员" value="3"></el-option>
          <el-option label="仓库管理员" value="4"></el-option>
          <el-option label="发货员" value="6"></el-option>
          <el-option label="团队经理" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团队" prop="group_id" v-show="employeeInfo.role_id==3">
        <el-select v-model="employeeInfo.group_id" placeholder="请选择等级">
          <el-option
            v-for="(item,index) in groupList"
            :key="index"
            :label="item.group_name"
            :value="item.group_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('employeeInfo')">立即创建</el-button>
        <el-button type="primary" @click="$router.push('/admin/staffList')" plain>返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {makeNewUserFun, getAllUserGroupFun} from "@/api/activity"

  export default {
    data() {
      return {
        groupList: [],
        employeeInfo: {
          phone: '',
          pwd: '',
          dPassword: '',
          real_name: '',
          sex: '',
          role_id: '',
          group_id: '',
        },
        rules: {
          real_name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
          ],
          phone: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur'}
          ],
          dPassword: [
            {validator: this.validatePass, trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请输入性别', trigger: 'change'}
          ],
          role_id: [
            {required: true, message: '请选择分组', trigger: 'change'}
          ]
        }
      };
    },
    mounted() {
      if (this.$route.query.id) {
      }
      this.getAllUserGroup();
    },
    methods: {
      validatePass(rule, value, callback) {
        console.log(value, this.employeeInfo.pwd);
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
       * 新增员工
       */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            makeNewUserFun(this.employeeInfo).then(res => {
              console.log(res);
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "新增成功",
                  type: "success",
                  center: true
                });
              }
              this.$router.push("/admin/staffList");
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
