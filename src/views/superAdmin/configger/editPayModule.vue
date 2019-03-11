<template>
  <section class="app-container calendar-list-container">
    <el-form
      :model="moduleInfo"
      :rules="rules"
      ref="moduleInfo"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="moduleInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-checkbox-group>
          <el-radio v-model="moduleInfo.pay_type" label="1">微信支付</el-radio>
          <el-radio v-model="moduleInfo.pay_type" label="2">支付宝</el-radio>
        </el-checkbox-group>
      </el-form-item>
      <div v-if="moduleInfo.pay_type==='1'">
        <el-form-item label="公众号(AppId)" prop="appId">
          <el-input v-model="moduleInfo.appId"></el-input>
        </el-form-item>
        <el-form-item label="支付商户号(Mch_id)" prop="mchId">
          <el-input v-model="moduleInfo.mchId"></el-input>
        </el-form-item>
        <el-form-item label="支付密钥(APIKEY)" prop="apiKey">
          <el-input v-model="moduleInfo.apiKey"></el-input>
        </el-form-item>
        <el-form-item label="CERT证书文件" v-model="moduleInfo.cert" prop="cert">
          <el-upload class="upload-demo" action="/api/file_upload" :data="imgType" :on-success="uploadCERTSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip prl1">只能上传jpg/png文件，且不超过500kb</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="KEY密钥文件" v-model="moduleInfo.key" prop="key">
          <el-upload class="upload-demo" action="/api/file_upload" :data="imgType" :on-success="uploadKEYSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip prl1">只能上传jpg/png文件，且不超过500kb</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="ROOT文件" v-model="moduleInfo.root" prop="root">
          <el-upload class="upload-demo" action="/api/file_upload" :data="imgType" :on-success="uploadRootSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip prl1">只能上传jpg/png文件，且不超过500kb</span>
          </el-upload>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="APPID" prop="appId">
          <el-input v-model="moduleInfo.appId"></el-input>
          <h6 class="text-muted">开放平台应用id</h6>
        </el-form-item>
        <el-form-item label="验签方式(SIGN_TYPE)">
          <el-checkbox-group>
            <el-radio v-model="moduleInfo.signType" label="1">RSA</el-radio>
            <el-radio v-model="moduleInfo.signType" label="2">RSA2</el-radio>
          </el-checkbox-group>
          <h6 class="text-muted">请选择正确的验证签名方式，否则支付宝支付不起作用<span class="text-danger">建议使用RSA2</span></h6>
        </el-form-item>
        <el-form-item label="支付宝公钥(PUBLIC_KEY)" prop="apiKey">
          <el-input v-model="moduleInfo.publicKey"></el-input>
        </el-form-item>
        <el-form-item label="应用私钥(PRIVATE_KEY)" prop="logo">
          <el-input v-model="moduleInfo.privateKey"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('moduleInfo')">提交</el-button>
        <el-button type="primary" @click="$router.push({path:'/superAdmin/payManager'})">返回列表</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
  import {updateModuleFun, getPayModulesFun} from "@/api/activity"

  export default {
    data() {
      return {
        imgType: {type: "other"},
        moduleInfo: {
          pay_type: "1",
          name: "",
          appid: "",
          mchId: "",
          apiKey: "",
          cert: "",
          key: "",
          root: "",
          signType: "",
          publicKey: "",
          privateKey: "",
        },
        rules: {
          name: [
            {required: true, message: "请输入模板名称", trigger: "blur"},
            {min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur"}
          ],
          appId: [
            {required: true, message: "请输入appId", trigger: "blur"},
          ],
          mchid: [
            {required: true, message: "请输入mchid", trigger: "blur"},
          ],
          apiKey: [
            {required: true, message: "请输入apiKey", trigger: "blur"},
          ],
          key: [
            {required: true, message: "请输入key", trigger: "blur"},
          ],
          root: [
            {required: true, message: "请输入root", trigger: "blur"},
          ],
          cert: [
            {required: true, message: "请输入cert", trigger: "blur"},
          ],
        },
      };
    },
    mounted() {
      this.getPayModules();
    },
    methods: {
      getPayModules() {
        getPayModulesFun().then(res => {
          console.log(res.data.data[this.$route.query.id]);
          if (res.data.success) {
            this.moduleInfo = res.data.data[this.$route.query.id].module
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            updateModuleFun(this.moduleInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "新增模板成功",
                  type: "success"
                });
                this.$refs["moduleInfo"].resetFields();
              }
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      /**
       * 上传图片成功后给数据赋值
       * */
      uploadCERTSuccess(response) {
        if (response.success) {
          this.moduleInfo.cert = response.data
        }
      },
      uploadKEYSuccess(response) {
        if (response.success) {
          this.moduleInfo.key = response.data
        }
      },
      uploadRootSuccess(response) {
        if (response.success) {
          this.moduleInfo.root = response.data
        }
      },
    }
  };
</script>
