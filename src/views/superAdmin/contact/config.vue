<template>
  <div class="app-container calendar-list-container client-list">
    <!-- 商户基础设置 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本" actived name="first">
        <el-form ref="baseInfo" :model="baseInfo" label-width="180px">
          <el-form-item label="是否开启多商户入驻设置" prop="isOpenRegist">
            <el-radio-group v-model="baseInfo.isOpenRegist">
              <el-radio label="开启" v-bind:value="1"></el-radio>
              <el-radio label="不开启" v-bind:value="0"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入驻页头部图片">
            <el-upload
              action="/api/file_upload"
              :data="imgType"
              class="upload-demo"
              :on-success="uploadCERTSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <span slot="tip" class="el-upload__tip prl1">只能上传jpg/png文件，且不超过500kb</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="商户提现设置" prop="CashOutType">
            <el-checkbox-group v-model="baseInfo.CashOutType">
              <el-checkbox label="手动提现到银行卡" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="提现额度" prop="CashOutMinAmount">
            <el-input v-model="baseInfo.CashOutMinAmount"></el-input>
          </el-form-item>
          <el-form-item label="提现手续费" prop="CashOutServiceCharge">
            <el-input v-model="baseInfo.CashOutServiceCharge"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('baseInfo')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="入驻申请协议" name="second">
        <el-form ref="agreeInfo" :model="agreeInfo" label-width="80px">
          <el-form-item label="协议名称">
            <el-input v-model="agreeInfo.titel"></el-input>
          </el-form-item>
          <el-form-item label="协议内容" style="height:300px">
            <quill-editor v-model="agreeInfo.content" ref="myQuillEditor" class="editer"></quill-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="update('agreeInfo')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {baseSettingFun, queryInfoFun, queryAgreeFun, settingAgreeFun} from "@/api/activity"

  export default {
    data() {
      return {
        imgType: {type: "merchant"},
        activeName: "first",
        baseInfo: {
          isOpenRegist: "1",
          BackgroudPic: "",
          CashOutType: "",
          CashOutMinAmount: "",
          CashOutServiceCharge: "",
        },
        agreeInfo: {
          titel: "",
          content: ""
        },
        rules: {
          isOpenRegist: [
            {required: true, message: '请选择', trigger: 'blur'},
          ],
          CashOutType: [
            {required: true, message: '请选择银行卡', trigger: 'change'}
          ],
          CashOutMinAmount: [
            {required: true, message: '请输入银行卡号', trigger: 'blur'}
          ],
          CashOutServiceCharge: [
            {required: true, message: '请输入银行卡号', trigger: 'blur'}
          ]
        }
      };
    },
    mounted() {
      this.queryInfo();
      this.queryAgreeInfo();
    },
    methods: {
      /**
       * 上传图片成功后给数据赋值
       * */
      uploadCERTSuccess(response) {
        if (response.success) {
          this.baseInfo.BackgroudPic = response.data
        }
      },
      queryInfo() {
        queryInfoFun().then(res => {
          console.log("info", res)
          if (res.data.success) {
            this.baseInfo = res.data.data;
          }
        })
      },
      queryAgreeInfo() {
        queryAgreeFun().then(res => {
          if (res.statusText === "OK") {
            this.agreeInfo = res.data;
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            baseSettingFun(this.baseInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "设置成功",
                  type: "success"
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      update(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            settingAgreeFun(this.agreeInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "设置成功",
                  type: "success"
                });
              }
            });
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
  .editer {
    height: 250px;
  }
</style>
