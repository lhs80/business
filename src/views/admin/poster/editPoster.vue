<template>
  <section class="app-container calendar-list-container">
    <el-form
      :model="postInfo"
      :rules="rules"
      ref="postInfo"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="海报名称" prop="poster_name">
        <el-input v-model="postInfo.poster_name"></el-input>
      </el-form-item>
      <el-form-item label="海报类型">
        <el-checkbox-group v-model="postInfo.type">
          <el-checkbox v-for="(item,index) in postTypeList" :label="item.id" :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择商品" prop="selGoodsName">
        <el-input v-model="selGoodsName" placeholder="请选择商品" :disabled="true">
          <el-button slot="append" type="primary" @click="isShowCommidyList = true">选择商品</el-button>
        </el-input>
        <ul class="mt2">
          <li v-for="(item, index) in multipleSelection" :key="index" class="pull-left" style="margin-right:20px">
            <img :src="item.logo" alt="" style="height:100px">
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="海报图片">
        <img :src="postInfo.logo" alt="" height="100px">
      </el-form-item>
      <el-form-item label="选择图片" prop="logo">
        <el-upload class="upload-demo" action="/file_upload" :data="imgType" list-type="picture"
                   :on-success="uploadSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <span slot="tip" class="el-upload__tip prl1">只能上传jpg/png文件，且不超过500kb</span>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('postInfo')">立即创建</el-button>
      </el-form-item>
    </el-form>
    <SelectGoodDlg :show="isShowCommidyList" :selectList="multipleSelection" @close="close"/>
  </section>
</template>
<script>
  import {queryPostDetailFun, updatePostFun} from '@/api/activity'
  import SelectGoodDlg from "./components/SelectGoodDlg";

  export default {
    components: {SelectGoodDlg},
    data() {
      return {
        imgType: {type: 'merchant'},
        isShowCommidyList: false,
        selGoodsName: '',//选择的商品名称
        postTypeList: [{name: '商品海报', id: 1}],
        postInfo: {
          posterId: this.$route.query.id,
          poster_name: '',
          logo: '',
          goods: [],
          type: '',
        },
        rules: {
          poster_name: [
            {required: true, message: '请输入活动名称'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符'}
          ],
          goods: [{required: true, message: '请至少选择一个商品'}],
          type: [{required: true, message: '请至少选择一个活动性质'}],
          logo: [{required: true, message: '请选择海报图片'}],
        },
        multipleSelection: [],
      };
    },
    mounted() {
      this.queryPostDetail();
    },
    methods: {
      /**
       * 海报详情
       **/
      queryPostDetail() {
        let params = {
          posterId: this.$route.query.id
        };
        queryPostDetailFun(params).then(res => {
          if (res.data.success) {
            this.postInfo = res.data.data;
            this.postInfo.type = [res.data.data.type];
            this.multipleSelection = res.data.data.goods;
            this.multipleSelection.forEach((item, index) => {
              this.selGoodsName += item.goods_name + ' ';
            });
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              posterId: this.$route.query.id,
              posterName: this.postInfo.poster_name,
              logo: this.postInfo.logo,
              goods: this.multipleSelection,
              type: this.postInfo.type.toString()
            };
            updatePostFun(params).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: '更新海报成功',
                  type: 'success'
                });
                this.$refs['postInfo'].resetFields();
              }
            })
          } else {
            console.log('error submit!!');
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
      /** * 上传图片成功后给数据赋值 * */
      uploadSuccess(response) {
        if (response.success) {
          this.postInfo.logo = response.data
        }
      }
    }
  };
</script>
