<template>
  <div class="app-container calendar-list-container addStaff-list">
    <div class="addStaff-set-option"></div>
    <el-form :model="addressInfo" :rules="rules" ref="addressInfo" label-width="120px">
      <el-form-item label="退货地址名称" prop="name">
        <el-input v-model="addressInfo.name" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="pname">
        <el-input v-model="addressInfo.pname" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="addressInfo.phone" placeholder="请输入手机" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮编" prop="post_code">
        <el-input v-model="addressInfo.post_code" placeholder="请输入邮编" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <div class="chushou-btn">
          <div class="client-edit-level">
            <el-select v-model="addressInfo.province" placeholder="请选择" @change="provinceChange">
              <el-option
                v-for="(item,index) in province"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="client-edit-level">
            <el-select v-model="addressInfo.city" placeholder="请选择" @change="cityChange">
              <el-option
                v-for="(item,index) in city"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="client-edit-level">
            <el-select v-model="addressInfo.county" placeholder="请选择">
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
      <el-form-item prop="detail_address">
        <el-input v-model="addressInfo.detail_address" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="是否默认" prop="is_default">
        <el-radio-group v-model="addressInfo.is_defult">
          <el-radio :label=1>是</el-radio>
          <el-radio :label=0>否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addressInfo')">立即修改</el-button>
        <el-button @click="$router.push('/admin/address')" plain>返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {editAddressListFun, addressListFun} from "@/api/activity"
  import ChinaAddress from '@/common/china_address_v4.json'

  export default {
    data() {
      return {
        groupList: [],
        province: Object.keys(ChinaAddress),
        city: [],
        county: [],
        addressInfo: {
          id: this.$route.query.id,
          pname: '',
          phone: '',
          province: '',
          city: '',
          county: '',
          detail_address: '',
          is_defult: '',
        },
        rules: {
          pname: [
            {required: true, message: '请输入收件人', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入退换货地址名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机', trigger: 'blur'}
          ],
          post_code: [
            {required: true, message: '请输入邮编', trigger: 'blur'}
          ],
          detail_address: [
            {required: true, message: '请输入没详细地址', trigger: 'blur'}
          ]
        }
      };
    },
    mounted() {
      this.getAllAddress();
    },
    methods: {
      /**
       *所有地址
       */
      getAllAddress() {
        addressListFun().then(res => {
          if (res.data.success) {
            res.data.data.forEach(item => {
              if (item.id === this.$route.query.id)
                this.addressInfo = item;
              console.log(this.addressInfo);
            })
          }
        })
      },
      /**
       * 新增地址
       */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            editAddressListFun(this.addressInfo).then(res => {
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
      provinceChange(value) {
        this.city = Object.keys(ChinaAddress[value]);
      },
      cityChange() {
        this.county = ChinaAddress[this.addressInfo.province][this.addressInfo.city]
      }
    }
  };
</script>
<style scoped>
  .addStaff-set-option {
    height: 55px;
  }

  .client-edit-level {
    float: left;
    width: 33.333%;
  }

  .chushou-btn {
    height: 55px;
  }
</style>
