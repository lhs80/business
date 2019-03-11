<template>
  <div class="app-container calendar-list-container addStaff-list">
    <div class="addStaff-set-option"></div>
    <el-form :model="sheetInfo" :rules="rules" ref="sheetInfo" label-width="150px">
      <el-form-item label="电子面单名称" prop="name">
        <el-input v-model="sheetInfo.name" placeholder="电子面单名称"></el-input>
      </el-form-item>
      <el-form-item label="快递公司" prop="shipper_code">
        <el-select v-model="sheetInfo.shipper_code" placeholder="请选择快递公司">
          <el-option
            v-for="(item,index) in expressList"
            :key="index.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电子面单客户账号" prop="customer_name">
        <el-input v-model="sheetInfo.customer_name" placeholder="请输入电子面单客户账号"></el-input>
      </el-form-item>
      <el-form-item label="电子面单密码" prop="customer_pwd">
        <el-input type="password" v-model="sheetInfo.customer_pwd" placeholder="请输入电子面单密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="月结编码" prop="month_code">
        <el-input v-model="sheetInfo.month_code" placeholder="请输入月结编码"></el-input>
      </el-form-item>
      <el-form-item label="收件网点标识" prop="send_site">
        <el-input v-model="sheetInfo.send_site" placeholder="请输入收件网点标识"></el-input>
      </el-form-item>
      <el-form-item label="邮费支付方式" prop="pay_type">
        <el-select v-model="sheetInfo.pay_type" placeholder="请选择邮费支付方式">
          <el-option label="现付" :value="1"></el-option>
          <el-option label="到付" :value="2"></el-option>
          <el-option label="月付" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否默认">
        <el-checkbox-group>
          <el-radio v-model="sheetInfo.is_defult" :label="1">是</el-radio>
          <el-radio v-model="sheetInfo.is_defult" :label="2">否</el-radio>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateEleSheetModel('sheetInfo')">提交</el-button>
        <el-button type="default" @click="$router.push('/admin/eleSheetModel')" plain>返回列表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {allExpressFun, getAllUserGroupFun, eleSheetModelListFun, updateEleSheetModelFun} from "@/api/activity"

  export default {
    data() {
      return {
        expressList: [],
        sheetInfo: {
          name: '',
          shipper_code: '',
          customer_name: '',
          customer_pwd: '',
          send_site: '',
          month_code: '',
          is_defult: '1',
          pay_type: ""
        },
        rules: {
          name: [
            {required: true, message: '请输入电子面单名称', trigger: 'blur'},
          ],
          shipper_code: [
            {required: true, message: '请选择快递公司', trigger: 'blur'}
          ],
          pay_type: [
            {required: true, message: '请选择邮费支付方式', trigger: 'blur'}
          ],
        }
      };
    },
    mounted() {
      this.allExpress();
      this.eleSheetModelList();
    },
    methods: {
      eleSheetModelList() {
        eleSheetModelListFun().then(res => {
          if (res.data.success) {
            res.data.data.forEach((item, index) => {
              if (item.id == this.$route.query.id)
                this.sheetInfo = item;
            });
          }
        })
      },
      allExpress() {
        allExpressFun().then(res => {
          if (res.data.success) {
            this.expressList = res.data.data;
          }
        })
      },
      updateEleSheetModel(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            updateEleSheetModelFun(this.sheetInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  message: '修改模板成功！',
                  type: 'success',
                  center: true
                });
                this.$router.push("/admin/eleSheetModel")
              }
            })
          }
        })
      }
    }
  };
</script>
