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
  import {mapGetters} from 'vuex';
  import {encode, initMenu} from '@/utils/util';
  import {login, supLogin, getOverTimeNoticFun} from '@/api/activity';
  import {setStore} from '../../utils/store';

  export default {
    name: 'userlogin',
    data() {
      return {
        loginForm: {
          name: '',
          pwd: ''
        },
        loginRules: {
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码长度最少为6位', trigger: 'blur'}
          ]
        },
        passwordType: 'password'
      };
    },
    created() {
      //  this.refreshCode()
    },
    mounted() {
    },
    computed: {
      ...mapGetters(['tagWel'])
    },
    props: [],
    methods: {
      showPassword() {
        this.passwordType === ''
          ? (this.passwordType = 'password')
          : (this.passwordType = '');
      },
      handleLogin(type) {
        let _this = this;
        if (type == 'sh') {
          _this.$refs.loginForm.validate(valid => {
            if (valid) {
              login(_this.loginForm).then(response => {
                if (response.data.success) {
                  if (response.data.data.roleId === '6') {
                    _this.$store.commit('SET_LOGINTYPE', 'sh-send');
                  } else if (response.data.data.role_id === 3) {
                    _this.$store.commit('SET_LOGINTYPE', 'ywy');
                  } else if (response.data.data.role_id === 7) {
                    _this.$store.commit('SET_LOGINTYPE', 'tdjl');
                  } else {
                    _this.$store.commit('SET_LOGINTYPE', 'sh');
                  }
                  setStore({
                    name: 'userinfo',
                    content: response.data.data
                  });
                  _this.$store.dispatch('GetMenu').then(data => {
                    initMenu(_this.$router, data);
                    if (!_this.$route.query.path) {
                      _this.$store.commit('ADD_TAG', _this.tagWel);
                      _this.$router.push({path: this.tagWel.value});
                    } else {
                      _this.$router.push({path: _this.$route.query.path});
                    }
                  });
                  getOverTimeNoticFun().then(res => {
                    let over4 = '';
                    let over3 = '';
                    let over15 = '';
                    if (res.data.success) {
                      res.data.data.over4days.forEach(item => {
                        over4 += item.name + ' '
                      });
                      res.data.data.over15dayNoOrder.forEach(item => {
                        over15 += item.name + ' '
                      });
                      res.data.data.threeDaysNotic.forEach(item => {
                        over3 += item.name + ' '
                      });
                      if (over4 || over3 || over15) {
                        this.$message({
                          showClose: false,
                          dangerouslyUseHTMLString: true,
                          message: `<div class="prl1">客户${over3}即将释放回公海，如想挽留，请保持跟进。</div>`,
                          type: 'warning',
                          duration: 10000
                        });
                        this.$message({
                          showClose: false,
                          dangerouslyUseHTMLString: true,
                          message: `<div class="prl1">客户${over4}，您已超过4天未跟进，请持续跟进或释放公海。</div>`,
                          type: 'warning',
                          duration: 10000
                        });
                        this.$message({
                          showClose: false,
                          dangerouslyUseHTMLString: true,
                          message: `<div class="prl1">客户${over15}已超过15天未下单，超过20天客户将释放回公海</div>`,
                          type: 'warning',
                          duration: 10000
                        });
                      }
                    }
                  })
                } else {
                  this.$message({
                    showClose: true,
                    message: response.data.msg,
                    type: 'warning',
                    center: true
                  })
                }
              });
            }
          });
        } else {
          _this.$refs.loginForm.validate(valid => {
            if (valid) {
              _this.$store.commit('SET_LOGINTYPE', 'admin');
              supLogin(_this.loginForm).then(response => {
                if (response.data.success) {
                  setStore({
                    name: 'userinfo',
                    content: response.data.data
                  });
                  this.$store.dispatch('GetMenu').then(data => {
                    initMenu(_this.$router, data);
                    if (!_this.$route.query.path) {

                      _this.$store.commit('ADD_TAG', _this.tagWel);
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
                    type: 'warning',
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
