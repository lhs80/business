<template>
  <div class="app-container calendar-list-container addStaff-list">
    <el-form :model="fareInfo" :rules="rules" ref="fareInfo" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="fareInfo.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="计费方式" prop="type">
        <el-radio-group v-model="fareInfo.type">
          <el-radio :label="1">按件计费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否默认" prop="is_defult">
        <el-radio-group v-model="fareInfo.is_defult">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="配送区域" prop="items">
        <el-row class="text-center">
          <el-col :span="11" class="text-left">运送到</el-col>
          <el-col :span="3">小于(元/个)</el-col>
          <el-col :span="3">数量(个)</el-col>
          <el-col :span="3">大于等于(元/个)</el-col>
          <el-col :span="3">最低运费</el-col>
          <el-col :span="1">管理</el-col>
        </el-row>
        <el-row :gutter="10" class="text-center" v-for="(item,index) in fareInfo.items" :key="index">
          <el-col :span="11" class="text-left h6 text-muted">
            <span v-for="(city,key) in item.city" :key="key">{{city}};</span>
            <span @click="editSelectArea(index)">编辑</span>
          </el-col>
          <el-col :span="3">
            <el-input size="small" v-model="item.less_money"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input size="small" v-model="item.base_count"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input size="small" v-model="item.greater_money"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input size="small" v-model="item.min_money"></el-input>
          </el-col>
          <el-col :span="1">
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <i class="el-icon-delete" @click="delItem(key)"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-button type="primary" size="small" @click="isShowAreaList = true">新增配送区域</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('fareInfo')" class="mt2">立即创建</el-button>
        <el-button @click="$router.push('/admin/fare')">返回列表</el-button>
      </el-form-item>
    </el-form>
    <!--选择商品弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="isShowAreaList">
      <div class="el-message-box el-message-box--center" style="width:400px">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">选择区域</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowAreaList=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-row :gutter="20">
            <el-col :span="12">
              <h5>省份</h5>
              <div style="height:200px;overflow:auto">
                <p v-for="(item,index) in province" :key="index" @click="provinceChange(item)" style="cursor:pointer">
                  {{item}}
                  <!--<el-checkbox :label="item" @change="provinceChange(item)"></el-checkbox>-->
                </p>
              </div>
            </el-col>
            <el-col :span="12">
              <h5>城市</h5>
              <div style="height:200px;overflow:auto">
                <p v-for="(item,index) in city" :key="index">
                  <el-checkbox @change="checked=>cityChange(checked,item.name)" v-model="item.isSel">
                    {{item.name}}
                  </el-checkbox>
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="addArea">
            <span>确定</span>
          </button>
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="isShowAreaList=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <!--选择商品弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="isShowEditAreaList">
      <div class="el-message-box el-message-box--center" style="width:400px">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">选择区域</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowEditAreaList=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-row :gutter="20">
            <el-col :span="12">
              <h5>省份</h5>
              <div style="height:200px;overflow:auto">
                <p v-for="(item,index) in province" :key="index" @click="editProvinceChange(item)"
                   style="cursor:pointer">
                  {{item}}
                  <!--<el-checkbox :label="item" @change="provinceChange(item)"></el-checkbox>-->
                </p>
              </div>
            </el-col>
            <el-col :span="12">
              <h5>城市</h5>
              <div style="height:200px;overflow:auto">
                <p v-for="(item,index) in city" :key="index">
                  <el-checkbox @change="checked=>cityChange(checked,item.name)" v-model="item.isSel">
                    {{item.name}}
                  </el-checkbox>
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="editArea">
            <span>确定</span>
          </button>
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="isShowEditAreaList=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <!--<div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowAreaList||isShowEditAreaList"></div>-->
  </div>
</template>
<script>
  import {addAddressListFun, addExpressTempFun} from "@/api/activity"
  import ChinaAddress from '@/common/china_address_v4.json'

  export default {
    data() {
      return {
        isShowAreaList: false,
        isShowEditAreaList: false,
        groupList: [],
        province: Object.keys(ChinaAddress),
        city: [],
        selectCity: [],
        editAreaIndex: "",
        fareInfo: {
          name: "",
          is_defult: 1,
          items: [],
          type: 1
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          items: [
            {required: true, message: '请选择配送区域', trigger: 'change'}
          ]
        }
      };
    },
    mounted() {
      this.city.push({name: Object.keys(ChinaAddress["北京市"])[0], isSel: false})
    },
    methods: {
      /**
       * 新增地址
       */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addExpressTempFun(this.fareInfo).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "新增成功",
                  type: "success",
                  center: true
                });
                this.$router.push('/admin/fare')
              }
            })
          } else {
            return false;
          }
        });
      },
      provinceChange(value) {
        this.city = [];
        Object.keys(ChinaAddress[value]).forEach((item, index) => {
          this.city.push({name: item, isSel: false});
        })
      },
      editProvinceChange(value) {
        this.city = [];
        Object.keys(ChinaAddress[value]).forEach((item, index) => {
          this.city.push({name: item, isSel: false});
        });
        let selCitys = this.fareInfo.items[this.editAreaIndex].city;
        this.city.forEach((item, index) => {
          if (selCitys.indexOf(item.name) >= 0) {
            item.isSel = true;
            this.selectCity.push(item.name);
          }
        })
      },
      cityChange(checked, value) {
        if (checked)
          this.selectCity.push(value);
        else
          this.selectCity.splice(this.selectCity.indexOf(value), 1);
      },
      addArea() {
        if (!this.selectCity.length) {
          this.$message({
            showClose: true,
            message: "没有选择城市",
            type: "warning",
            center: true
          });
          return false;
        }
        this.city.push({name: Object.keys(ChinaAddress["北京市"])[0], isSel: false});
        this.fareInfo.items.push({
          city: this.selectCity,
          base_count: 0,
          less_money: 0,
          greater_money: 0,
          min_money: 0
        });
        this.selectCity = [];
        this.isShowAreaList = false;
      },
      editArea() {
        if (!this.selectCity.length) {
          this.$message({
            showClose: true,
            message: "没有选择城市",
            type: "warning",
            center: true
          });
          return false;
        }
        this.city.push({name: Object.keys(ChinaAddress["北京市"])[0], isSel: false});
        this.fareInfo.items[this.editAreaIndex].city = this.selectCity;
        this.selectCity = [];
        this.isShowEditAreaList = false;
      },
      delItem(index) {
        this.fareInfo.items.splice(index, 1);
      },
      editSelectArea(index) {
        this.isShowEditAreaList = true;
        this.editAreaIndex = index;
      }
    }
  };
</script>
