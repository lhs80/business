<template>
  <el-form
    class="login-form"
    status-icon
    :rules="loginRules"
    ref="loginForm"
    :model="loginForm"
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        v-model="loginForm.name"
        auto-complete="off"
        placeholder="请输入用户名"
      >
        <i slot="prefix" class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="pwd">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        :type="passwordType"
        v-model="loginForm.pwd"
        auto-complete="off"
        placeholder="请输入密码"
      >
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item>
      <div style="float:left;width:130px;margin-right: 5px;">
        <el-button
          type="primary"
          size="small"
          @click.native.prevent="handleLogin('admin')"
          class="login-submit"
          size:small
        >超管登录
        </el-button>
      </div>
      <div style="float:left;width:130px;">
        <el-button
          type="primary"
          size="small"
          @click.native.prevent="handleLogin('sh')"
          class="login-submit"
        >商户登录
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
  import {randomLenNum} from "@/utils/util";
  import {mapGetters} from "vuex";
  import {encode, initMenu} from "@/utils/util";
  import {login, supLogin} from "@/api/activity";
  import {setStore} from "../../utils/store";

  export default {
    name: "userlogin",
    data() {
      //  const validateCode = (rule, value, callback) => {
      //    if (this.code.value !== value) {
      //      this.loginForm.code = ''
      //      this.refreshCode()
      //      callback(new Error('请输入正确的验证码'))
      //    } else {
      //      callback()
      //    }
      //  }

      return {
        loginForm: {
          name: "",
          pwd: ""
        },
        loginRules: {
          pwd: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 6, message: "密码长度最少为6位", trigger: "blur"}
          ]
        },
        passwordType: "password"
      };
    },
    created() {
      //  this.refreshCode()
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["tagWel"])
    },
    props: [],
    methods: {
      showPassword() {
        this.passwordType === ""
          ? (this.passwordType = "password")
          : (this.passwordType = "");
      },
      handleLogin(type) {
        let _this = this;
        if (type == "sh") {
          _this.$refs.loginForm.validate(valid => {
            if (valid) {
              login(_this.loginForm).then(response => {
                if (response.data.success) {
                  if (response.data.data.roleId === '6') {
                    _this.$store.commit("SET_LOGINTYPE", "sh-send");
                  } else if (response.data.data.role_id === 3) {
                    _this.$store.commit("SET_LOGINTYPE", "ywy");
                  } else if (response.data.data.role_id === 7) {
                    _this.$store.commit("SET_LOGINTYPE", "tdjl");
                  } else {
                    _this.$store.commit("SET_LOGINTYPE", "sh");
                  }
                  setStore({
                    name: 'userinfo',
                    content: response.data.data
                  });
                  console.log(response.data.data);
                  _this.$store.dispatch("GetMenu").then(data => {
                    initMenu(_this.$router, data);
                    if (!_this.$route.query.path) {
                      _this.$store.commit("ADD_TAG", _this.tagWel);
                      console.log("tagWel", _this.tagWel);
                      _this.$router.push({path: this.tagWel.value});
                    } else {
                      _this.$router.push({path: _this.$route.query.path});
                    }
                  });
                } else {
                  this.$message({
                    showClose: true,
                    message: response.data.msg,
                    type: "warning",
                    center: true
                  })
                }
              });
            }
          });
        } else {
          _this.$refs.loginForm.validate(valid => {
            if (valid) {
              _this.$store.commit("SET_LOGINTYPE", "admin");
              supLogin(_this.loginForm).then(response => {
                if (response.data.success) {
                  setStore({
                    name: 'userinfo',
                    content: response.data.data
                  });
                  this.$store.dispatch("GetMenu").then(data => {
                    initMenu(_this.$router, data);
                    if (!_this.$route.query.path) {

                      _this.$store.commit("ADD_TAG", _this.tagWel);
                      console.log(this.tagWel.value);
                      _this.$router.push({path: this.tagWel.value});
                    } else {
                      _this.$router.push({path: _this.$route.query.path});
                    }
                  });
                } else {
                  this.$message({
                    showClose: true,
                    message: response.data.msg,
                    type: "warning",
                    center: true
                  })
                }
              });
            }
          });
        }
      }
    }
  };
</script>

<style>
</style>
