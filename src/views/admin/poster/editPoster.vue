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
        <el-checkbox-group v-model="postInfo.type" @change="typeChange">
          <el-checkbox v-for="(item,index) in postTypeList" :label="item.id" :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择商品" prop="selGoodsName">
        <el-input v-model="selGoodsName" placeholder="请输入内容">
          <el-button slot="append" type="primary" @click="isShowCommidyList=true">选择商品</el-button>
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
        <el-upload class="upload-demo" action="/file_upload" :data="imgType" list-type="picture" :on-success="uploadSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <span slot="tip" class="el-upload__tip prl1">只能上传jpg/png文件，且不超过500kb</span>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('postInfo')">立即创建</el-button>
      </el-form-item>
    </el-form>
    <!--选择商品弹框-->
    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
         style="z-index: 99;" v-show="isShowCommidyList">
      <div class="el-message-box el-message-box--center" style="width:60%">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">数据选择器</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowCommidyList=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="catId" placeholder="选择商品分类" size="mini" @change="getAllGoods">
                <el-option key="0" label="全部" value=""></el-option>
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input placeholder="请输入关键字" size="mini" v-model="searchKey"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="default" @click="getAllGoods" size="mini">搜索</el-button>
            </el-col>
          </el-row>
          <el-table
            ref="goodList"
            :data="goodList"
            tooltip-effect="dark"
            style="width: 100%"
            @select="handleSelectionChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="商品图片">
              <template slot-scope="scope"><img :src="scope.row.logo" alt="logo" style="height:60px;"></template>
            </el-table-column>
            <el-table-column property="goods_name" label="商品名称"></el-table-column>
            <el-table-column property="reserve" label="库存"></el-table-column>
          </el-table>
          <el-pagination
            v-if="paginations.total > 0"
            :page-sizes="paginations.pageSizes"
            :page-size="paginations.page_size"
            :layout="paginations.layout"
            :total="paginations.total"
            :current-page="paginations.page_index"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            class="mt2 text-right"
          ></el-pagination>
        </div>
        <div class="el-message-box__btns">
          <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                  @click="isShowCommidyList=false">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowCommidyList"></div>
  </section>
</template>
<script>
  import {getGoodsList, getBrand, queryPostDetailFun, updatePostFun} from "@/api/activity"

  export default {
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
          posterId: this.$route.query.id,
          poster_name: "",
          logo: "",
          goods: [],
          type: "",
        },
        rules: {
          poster_name: [
            {required: true, message: "请输入活动名称", trigger: "blur"},
            {min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur"}
          ],
          goods: [
            {
              type: "array",
              required: true,
              message: "请至少选择一个商品",
              trigger: "change"
            }
          ],
          type: [
            {
              type: "array",
              required: true,
              message: "请至少选择一个活动性质",
              trigger: "change"
            }
          ],
          logo: [
            {required: true, message: "请选择海报图片", trigger: "blur"}
          ],
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
    mounted() {
      this.queryPostDetail();
      this.getAllGoods();
      this.getData();
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
          console.log("detail", res);
          if (res.data.success) {
            this.postInfo = res.data.data;
            this.postInfo.type = [res.data.data.type];
            this.multipleSelection = res.data.data.goods;
            this.multipleSelection.forEach((item, index) => {
              this.selGoodsName += item.goods_name + " ";
            });
          }
        })
      },
      /**
       * 所有商品
       */
      getAllGoods() {
        let params = {
          cat_id: this.catId,
          type: 1,
          searchKey: this.searchKey,
          pageSize: this.paginations.page_size,
          pageIndex: this.paginations.page_index,
        };
        getGoodsList(params).then(res => {
          if (res.data.success) {
            this.goodList = res.data.data.data;
            this.paginations.page_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
            if (this.multipleSelection.length) {
              this.toggleSelection(this.multipleSelection)
            }
          }
        });
      },
      /**
       * 所有品牌
       */
      getData() {
        getBrand().then(res => {
          if (res.data.success)
            this.brandList = res.data.data;
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              posterId: this.$route.query.id,
              posterName: this.postInfo.poster_name,
              logo: this.postInfo.logo,
              goods: this.postInfo.goods,
              type: this.postInfo.type.toString()
            };
            updatePostFun(params).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: "更新海报成功",
                  type: "success"
                });
                this.$refs["postInfo"].resetFields();
              }
            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      /**
       * 选择的商品
       */
      handleSelectionChange(select, val) {
        if (!select) return false;
        this.selGoodsName += val.goods_name + " ";
        this.postInfo.goods.push(val);
        this.multipleSelection.push(val);
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.getAllGoods()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.getAllGoods();
      },
      // 选中table已有数据
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.goodList.forEach((item, index) => {
              if (item.goods_id == row.goods_id) {
                this.$nextTick(() => {
                  this.$refs.goodList.toggleRowSelection(this.goodList[index])
                })
              }
            });
          })
        } else {
          this.$refs.goodList.clearSelection()
        }
      },
      /**
       * 上传图片成功后给数据赋值
       * */
      uploadSuccess(response) {
        if (response.success) {
          this.postInfo.logo = response.data
        }
      },
      typeChange(value) {
        console.log(value)
      }
    }
  };
</script>
