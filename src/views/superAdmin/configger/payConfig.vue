<template>
  <div class="app-container calendar-list-container client-list">
    <div class="card">
      <el-row class="title" type="flex" align="middle">
        <el-col :span="12" class="h1 prl2">微信支付</el-col>
        <el-col :span="12" class="text-right prl1">
          <el-switch v-model="wxPayModule.is_use" active-color="#13ce66" @change="setWxPayCanUse"></el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="7" style="padding-top:80px">
          <span>选择支付：</span>
          <el-select v-model="wxPayModule.id" placeholder="请选择" style="display:inline-block;width:50% !important;"
                     @change="setWxPayCanUse">
            <el-option
              v-for="item in wxPayList"
              :key="item.id"
              :label="item.module.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="card">
      <el-row class="title" type="flex" align="middle">
        <el-col :span="12" class="h1 prl2">支付宝支付</el-col>
        <el-col :span="12" class="text-right prl1">
          <el-switch v-model="apliyPayModule.is_use" active-color="#13ce66" @change="setApliyPayCanUse"></el-switch>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="7" style="padding-top:80px">
          <span>选择支付：</span>
          <el-select v-model="apliyPayModule.id" placeholder="请选择" style="display:inline-block;width:50% !important;"
                     @change="setApliyPayCanUse">
            <el-option
              v-for="item in apliyPayList"
              :key="item.id"
              :label="item.module.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {usingModuleFun, settingModuleFun, getPayModulesFun} from "@/api/activity"

  export default {
    data() {
      return {
        wxPayList: [],
        apliyPayList: [],
        wxPayModule: {
          id: "",
          is_use: 0,
          pay_type: "1"
        },
        apliyPayModule: {
          id: "",
          is_use: 0,
          pay_type: "2"
        }
      };
    },
    mounted() {
      this.getWxPayModules();
      this.getApliyPayModules();
      this.getPayModules();
    },
    methods: {
      getPayModules() {
        getPayModulesFun().then(res => {
          console.log(res.data.data);
          if (res.data.success) {
            res.data.data.forEach((item, index) => {
              if (item.module.pay_type == '1')
                this.wxPayList.push(item);
              else if (item.module.pay_type == '2')
                this.apliyPayList.push(item)
            })
          }
        })
      },
      getWxPayModules() {
        let params = {
          pay_type: "1"
        };
        usingModuleFun(params).then(res => {
          console.log("wxModule", res);
          if (res.data.success && res.data.data) {
            this.wxPayModule.id = res.data.data.module.id;
            this.wxPayModule.is_use = res.data.data.module.is_use === 1 ? true : false
          }
        })
      },
      getApliyPayModules() {
        let params = {
          pay_type: "2"
        };
        usingModuleFun(params).then(res => {
          console.log("apliy", res);
          if (res.data.success && res.data.data) {
            this.apliyPayModule.id = res.data.data.module.id;
            this.apliyPayModule.is_use = res.data.data.module.is_use === 1 ? true : false
          }
        })
      },
      setWxPayCanUse() {
        let params = {
          id: this.wxPayModule.id,
          is_use: this.wxPayModule.is_use ? 1 : 0,
          pay_type: "1"
        };
        settingModuleFun(params).then(res => {
          console.log("wx", res)
        })
      },
      setApliyPayCanUse() {
        let params = {
          id: this.apliyPayModule.id,
          is_use: this.apliyPayModule.is_use ? 1 : 0,
          pay_type: "2"
        };
        settingModuleFun(params).then(res => {
          console.log("apliy", res)
        })
      },
    }
  };
</script>
<style scoped>
  .card {
    height: 250px;
    border: solid 1px #e5e5e5;
  }

  .card + .card {
    margin-top: 30px
  }

  .card .title {
    border-bottom: solid 1px #e5e5e5;
  }
</style>
