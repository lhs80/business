<template>
  <section class="app-container calendar-list-container">
    <el-form
      :model="postInfo"
      :rules="rules"
      ref="postInfo"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="海报名称" prop="posterName">
        <el-input v-model="postInfo.posterName"></el-input>
      </el-form-item>
      <el-form-item label="海报类型">
        <el-checkbox-group v-model="postInfo.type">
          <el-checkbox v-for="(item,index) in postTypeList" :label="item.id" :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择商品" prop="selGoodsName">
        <el-input v-model="selGoodsName" placeholder="请输入内容" :disabled="true">
          <el-button slot="append" type="primary" @click="isShowCommidyList=true">选择商品</el-button>
        </el-input>
        <ul class="mt2">
          <li v-for="(item, index) in multipleSelection" :key="index" class="pull-left" style="margin-right:20px">
            <img :src="item.logo" alt="" style="height:100px">
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="选择图片" prop="logo">
        <el-upload
          class="upload-demo"
          action="http://m.gongjiangsht.com/file_upload"
          :data="imgType"
          list-type="picture"
          :on-success="uploadSuccess"
          :with-credentials="true"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <span slot="tip" class="el-upload__tip prl1">只能上传jpg/png文件，且不超过500kb</span>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('postInfo')">立即创建</el-button>
      </el-form-item>
    </el-form>
    <!--选择商品弹框-->
    <SelectGoodDlg :show="isShowCommidyList" :selectList="multipleSelection" @close="close"/>
  </section>
</template>
<script>
  import {getGoodsList, getBrand, addPostFun} from "@/api/activity"
  import SelectGoodDlg from "./components/SelectGoodDlg";

  export default {
    components: {SelectGoodDlg},
    data() {
      return {
        imgType: {type: "merchant"},
        catId: '',//分类ID
        searchKey: '',
        isShowCommidyList: false,
        selGoodsName: '',//选择的商品名称
        goodList: [],//所有商品列表
        brandList: [],//所有品牌列表
        postTypeList: [{name: "商品海报", id: 1}],
        postInfo: {
          posterName: "",
          logo: "",
          goods: [],
          type: [1],
        },
        rules: {
          posterName: [
            {required: true, message: "请输入活动名称", trigger: "blur"},
            {min: 3, max: 5, message: "长度在 3 到 8 个字符", trigger: "blur"}
          ],
          goods: [{required: true, message: "请至少选择一个商品",}],
          type: [{required: true, message: "请至少选择一个活动性质",}],
          logo: [{required: true, message: "请选择海报图片"}],
        },
        // 选择的商品
        multipleSelection: [],
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        },
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              ...this.postInfo,
              goods: this.multipleSelection
            };
            addPostFun(params).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "新增海报成功",
                  type: "success"
                });
                this.$router.push({path: "/admin/posterList"});
              }
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      close(items) {
        this.isShowCommidyList = false;
        this.selGoodsName = '';
        this.multipleSelection = items;
        this.multipleSelection.forEach(item => {
          this.selGoodsName += item.goods_name + ' '
        })
      },
      /**
       * 上传图片成功后给数据赋值
       * */
      uploadSuccess(response) {
        if (response.success) {
          this.postInfo.logo = response.data
        }
      },
    }
  };
</script>
