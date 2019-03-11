<template>
  <div class="app-container calendar-list-container addStaff-list">
    <div class="addStaff-set-option"></div>
    <el-form :model="employeeInfo" :rules="rules" ref="employeeInfo" label-width="150px">
      <el-form-item label="发件人" prop="phone">
        <el-input v-model="employeeInfo.phone" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item label="发件人电话" prop="role_id">
        <el-input v-model="employeeInfo.phone" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item label="省市区" prop="pwd">
        <div class="chushou-btn">
          <div class="client-edit-level">
            <el-select v-model="employeeInfo.phone" placeholder="请选择" @change="provinceChange">
              <el-option
                v-for="(item,index) in province"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="client-edit-level">
            <el-select v-model="employeeInfo.phone" placeholder="请选择" @change="cityChange">
              <el-option
                v-for="(item,index) in city"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="client-edit-level">
            <el-select v-model="employeeInfo.phone" placeholder="请选择">
              <el-option
                v-for="item in county"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="发件地址" prop="dPassword">
        <el-input type="password" v-model="employeeInfo.dPassword" placeholder="请再次输入密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否默认" prop="sex">
        <el-radio v-model="employeeInfo.role_id" label="1">是</el-radio>
        <el-radio v-model="employeeInfo.role_id" label="2">否</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('employeeInfo')">提交</el-button>
        <el-button type="default" @click="$router.push('/admin/staffList')" plain>返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {allExpressFun, getAllUserGroupFun} from "@/api/activity"
  import ChinaAddress from '@/common/china_address_v4.json'

  export default {
    data() {
      return {
        expressList: [],
        province: Object.keys(ChinaAddress),
        city: [],
        county: [],
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
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
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
          ],
          group_id: [
            {required: true, message: '请选择团队', trigger: 'change'}
          ]
        }
      };
    },
    mounted() {
      this.allExpress();
    },
    methods: {
      allExpress() {
        allExpressFun().then(res => {
          if (res.data.success) {
            this.expressList = res.data.data;
          }
        })
      },
      provinceChange(value) {
        // this.city = Object.keys(ChinaAddress[value]);
      },
      cityChange() {
        // this.county = ChinaAddress[this.address.province][this.address.city]
      }
    }
  };
</script>
<style scoped lang="scss">

  .client-edit-level {
    float: left;
    width: 33.333%;
  }

  .client-filter {
    float: left;
    margin-left: 10px;
  }

  .chushou-btn {
    height: 55px;
  }
</style>
