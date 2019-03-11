<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-form
            :model="ruleForm2"
            :rules="rules2"
            ref="ruleForm2"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input type="text" :value="userInfo.loginName" disabled></el-input>
            </el-form-item>
            <el-form-item label="显示名" prop="username">
              <el-input type="text" v-model="ruleForm2.displayName" :value="userInfo.displayName"></el-input>
            </el-form-item>

            <el-form-item label="原密码" prop="password">
              <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="newpassword1">
              <el-input type="password" v-model="ruleForm2.newpassword1" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="newpassword2">
              <el-input type="password" v-model="ruleForm2.newpassword2" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="ruleForm2.phoneNo" placeholder="手机号"></el-input>
            </el-form-item>

            <!-- <el-form-item label="头像">
              <my-upload field="file" @crop-upload-success="cropUploadSuccess" v-model="show" :width="300" :height="300" url="http://10.16.30.9:8080/api/user/v1/updateUser/post" :headers="headers" img-format="png"></my-upload>
              <img :src="ruleForm2.avatar">
              <el-button type="primary" @click="toggleShow" size="mini">选择
                <i class="el-icon-upload el-icon--right"></i>
              </el-button>
            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
              <!-- <el-button @click="resetForm('ruleForm2')">重置</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { mapState } from "vuex";
import myUpload from "vue-image-crop-upload";
import { getToken } from "@/utils/auth";
import ElFormItem from "element-ui/packages/form/src/form-item.vue";
import request from "@/api/axios";
import { updateUser, updatePass } from "@/api/user";
import { encode, initMenu } from "@/utils/util";

export default {
  components: {
    ElFormItem,
    "my-upload": myUpload
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.ruleForm2.password !== "") {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (value.length < 6) {
          callback(new Error("密码不能小于6位"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (this.ruleForm2.password !== "") {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.ruleForm2.newpassword1) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      fileList: [],
      show: false,
      headers: {
        Authorization: "Bearer " + getToken()
      },
      ruleForm2: {
        password: "",
        newpassword1: "",
        newpassword2: "",
        phoneNo: "",
        id: "",
        displayName: ""
      },
      pwd:{
        password:"",
        oldPassword:""
      },
      rules2: {
        newpassword1: [{ validator: validatePass, trigger: "blur" }],
        newpassword2: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {
    this.ruleForm2.avatar = this.userInfo.avatar;
    this.ruleForm2.phoneNo = this.userInfo.phoneNo;
    this.ruleForm2.displayName = this.userInfo.displayName;
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    submitForm(formName) {
      let _this = this;
      _this.ruleForm2.id = _this.userInfo.id;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          updateUser(_this.ruleForm2)
            .then(response => {
              if (response) {
                _this.$notify({
                  title: "修改成功",
                  type: "success",
                  duration: 2000
                });
              } else {
                _this.$notify({
                  title: "失败",
                  message: response.data.msg,
                  type: "error",
                  duration: 2000
                });
              }
            })
            .catch(() => {
              _this.$notify({
                title: "失败",
                message: "修改失败",
                type: "error",
                duration: 2000
              });
            });
          if (_this.ruleForm2.newpassword1) {
            _this.pwd.password=encode(_this.ruleForm2.newpassword1);
            _this.pwd.oldPassword=encode(_this.ruleForm2.password);
            updatePass(_this.pwd).then(response => {
              // 修改密码之后强制重新登录
              if (response) {
                _this.$store.dispatch("LogOut").then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
              }
            });
          }
          
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName);
      this.$refs[formName].resetFields();
    },
    toggleShow() {
      this.show = !this.show;
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      this.$store.commit("SET_AVATAR", jsonData.filename);
    }
  }
};
</script>
