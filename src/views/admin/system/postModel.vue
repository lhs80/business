<template>
  <section class="app-container calendar-list-container">
    <el-form
      :model="printInfo"
      :rules="rules"
      ref="printInfo"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="打印机类型">
        <el-input v-model="printInfo.type"></el-input>
      </el-form-item>
      <el-form-item label="识别码" prop="pkey">
        <el-input v-model="printInfo.pkey"></el-input>
      </el-form-item>
      <el-form-item label="打印机编号" prop="sn">
        <el-input v-model="printInfo.sn"></el-input>
      </el-form-item>
      <el-form-item label="打印联数" prop="printCount">
        <el-input v-model="printInfo.printCount"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('printInfo')">提交</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
  import {getPrintInfoFun, setPrintInfoFun} from '@/api/activity'

  export default {
    data() {
      return {
        printInfo: {
          type: '飞鹅打印机(新接口)',
          sn: '',
          pkey: '',
          printCount: '',
        },
        rules: {
          sn: [{required: true, message: '请输入识中坚力量码', trigger: 'blur'}],
          pkey: [{required: true, message: '请输入打印机编号', trigger: 'blur'}],
          printCount: [{required: true, message: '请输入打印联数', trigger: 'blur'},]
        }
      };
    },
    mounted() {
      this.getPrintInfo();
    },
    methods: {
      /**
       * 获取打印机信息
       */
      getPrintInfo() {
        getPrintInfoFun().then(res => {
          if (res.data.success)
            this.printInfo = {type: this.printInfo.type, ...res.data.data};
        });
      },
      /**
       * 设置打印机信息
       */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            setPrintInfoFun(this.printInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: '设置成功',
                  type: 'success'
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  };
</script>
