<!--打印机设置-->
<template>
  <div class="app-container calendar-list-container addStaff-list">
    <el-form :model="printInfo" :rules="rules" ref="printInfo" label-width="100px" style="width:80%;margin:0 auto">
      <div>
        <h1>打印机设置</h1>
        <h6>注意: 1. 请将打印机连接至本机。2. 在本机上安装打印控件。3. 将打印控件中的打印端口下面的打印端口设为相同。</h6>
      </div>
      <el-form-item label="ip端口" prop="port" class="mt2">
        <el-input v-model="printInfo.ip"></el-input>
      </el-form-item>
      <div>
        <h1>电子面单设置</h1>
        <h6 class="text-info">注意: 1. 注册快递鸟ID。2. 实名认证。3. 申请电子面单API：在快递鸟用户管理后台--申请API页面，点击申请电子面单API。
          4. 将快递鸟用户ID以及API key填入以下表单
        </h6>
      </div>
      <el-form-item label="快鸟ID" prop="id" class="mt2">
        <el-input v-model="printInfo.appId" placeholder="请输入快鸟ID"></el-input>
      </el-form-item>
      <el-form-item label="API key" prop="apiKey">
        <el-input v-model="printInfo.appKey" placeholder="请输入API key"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="settingExpress('printInfo')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {settingExpressFun, queryExpressFun} from "@/api/activity"

  export default {
    data() {
      return {
        printInfo: {
          ip: "",
          appId: "",
          appKey: ""
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
      this.queryExpress();
    },
    methods: {
      queryExpress() {
        queryExpressFun().then(res => {
          if (res.data.success) {
            console.log(res)
            this.printInfo = res.data.data;
          }
        })
      },
      settingExpress(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            settingExpressFun(this.printInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  center: true
                });
              }
            })
          }
        })
      }
    }
  };
</script>
