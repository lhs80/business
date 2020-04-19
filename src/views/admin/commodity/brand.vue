<template>
  <div class="app-container calendar-list-container brand-list">
    <!-- 商户分类 -->
    <div v-show="brandListIsShow">
      <div class="classify-set-option">
        <div class="classify-edit-level">
          <el-button type="primary" size="small" @click="addBrand">添加品牌</el-button>
        </div>
      </div>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="品牌名称" align="center"></el-table-column>
        <el-table-column prop="goodsArr" label="商品数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsArr.length }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <i class="el-icon-edit" title="编辑" @click="showBrandDetail(scope.row)"></i>
            <i class="el-icon-delete" title="删除" @click="delSingleBrand(scope.row.id)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加品牌页 -->
    <div class="add-brand-page" v-show="addBrandIsShow">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="品牌商品" prop="type">
          <el-input v-model="selGoodsName" placeholder="请输入内容">
            <el-button slot="append" type="primary" @click="isShowCommidyList=true" readonly="readonly">选择商品</el-button>
          </el-input>
          <ul class="mt2">
            <li v-for="(item, index) in multipleSelection" :key="index" class="pull-left" style="margin-right:20px">
              <img :src="item.logo" alt="" style="height:100px">
            </li>
          </ul>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" v-if="type==='add'">立即创建</el-button>
          <el-button type="primary" @click="edit('ruleForm')" v-if="type==='edit'">立即修改</el-button>
          <el-button @click="backBrandList">返回列表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :visible="isShowCommidyList" title="数据选择器">
      <div style="height:500px;overflow-y:auto">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="catId" placeholder="选择商品分类" size="mini" @change="getAllGoods">
              <el-option key="0" label="全部" value=""></el-option>
              <el-option
                v-for="item in tableData"
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
          ref="multipleTable"
          :data="goodList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="商品图片">
            <template slot-scope="scope"><img :src="scope.row.logo" alt="logo" style="height:60px;"></template>
          </el-table-column>
          <el-table-column property="goods_name" label="商品名称"></el-table-column>
          <el-table-column property="reserve" label="库存"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <button type="button" class="el-button el-button--default el-button--small el-button--primary"
                @click="isShowCommidyList=false">
          <span>关闭</span>
        </button>
      </div>
    </el-dialog>
    <!--选择商品弹框-->
    <!--    <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"-->
    <!--         style="z-index: 99;" v-show="isShowCommidyList">-->
    <!--      <div class="el-message-box el-message-box&#45;&#45;center" style="width:60%">-->
    <!--        <div class="bg-grey">-->
    <!--          <el-row class="prl2">-->
    <!--            <el-col :span="12" class="h5">数据选择器</el-col>-->
    <!--            <el-col :span="12" class="text-right h4">-->
    <!--              <i class="el-message-box__close el-icon-close" @click="isShowCommidyList=false"></i>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--        </div>-->
    <!--        <div class="el-message-box__content">-->
    <!--          <el-row :gutter="20">-->
    <!--            <el-col :span="6">-->
    <!--              <el-select v-model="catId" placeholder="选择商品分类" size="mini" @change="getAllGoods">-->
    <!--                <el-option key="0" label="全部" value=""></el-option>-->
    <!--                <el-option-->
    <!--                  v-for="item in tableData"-->
    <!--                  :key="item.id"-->
    <!--                  :label="item.name"-->
    <!--                  :value="item.id"-->
    <!--                ></el-option>-->
    <!--              </el-select>-->
    <!--            </el-col>-->
    <!--            <el-col :span="5">-->
    <!--              <el-input placeholder="请输入关键字" size="mini" v-model="searchKey"></el-input>-->
    <!--            </el-col>-->
    <!--            <el-col :span="2">-->
    <!--              <el-button type="default" @click="getAllGoods" size="mini">搜索</el-button>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--          <el-table-->
    <!--            ref="multipleTable"-->
    <!--            :data="goodList"-->
    <!--            tooltip-effect="dark"-->
    <!--            style="width: 100%"-->
    <!--            @selection-change="handleSelectionChange"-->
    <!--          >-->
    <!--            <el-table-column type="selection"></el-table-column>-->
    <!--            <el-table-column label="商品图片">-->
    <!--              <template slot-scope="scope"><img :src="scope.row.logo" alt="logo" style="height:60px;"></template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column property="goods_name" label="商品名称"></el-table-column>-->
    <!--            <el-table-column property="reserve" label="库存"></el-table-column>-->
    <!--          </el-table>-->
    <!--        </div>-->
    <!--        <div class="el-message-box__btns">-->
    <!--          <button type="button" class="el-button el-button&#45;&#45;default el-button&#45;&#45;small el-button&#45;&#45;primary"-->
    <!--                  @click="isShowCommidyList=false">-->
    <!--            <span>关闭</span>-->
    <!--          </button>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowCommidyList"></div>-->
  </div>
</template>
<script>
  import {getBrand, delBrand, addBrand, editBrand, getGoodsList} from "@/api/activity";

  export default {
    data() {
      return {
        type: "",
        curBrand: {},
        catId: "",//分类ID
        searchKey: "",
        selGoodsName: '',//选择的商品名称
        goodList: [],
        brandListIsShow: true,
        addBrandIsShow: false,
        isShowCommidyList: false,// 选择商品列表是否显示
        isShowBrandDetail: false,// 是否显示品牌详情
        tableData: [],//分类列表
        brandTable: [], // 选择商品表格的数据
        multipleSelection: [],// 选择的商品
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        },
        ruleForm: {
          id: "",
          name: "",
          item: [],//选择的商品ID
        },
        rules: {
          name: [
            {required: true, message: "请输入品牌名称", trigger: "blur"},
            {min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur"}
          ],
        }
      };
    },
    mounted() {
      this.getData();
      this.getAllGoods();
    },
    methods: {
      showBrandDetail(item) {
        this.type = "edit";
        this.ruleForm = item;
        item.goodsArr.forEach((item, index) => {
          this.selGoodsName += item.goods_name + ",";
          this.ruleForm.item += item.goods_id + ",";
        });

        this.brandListIsShow = false;
        this.addBrandIsShow = true;
      },
      /**
       * 所有商品
       */
      getAllGoods() {
        let params = `?cat_id=${this.catId}&type=1&searchKey=${this.searchKey}&&pageSize=${this.paginations.page_size}&pageIndex=${this.paginations.page_index}`;
        getGoodsList(params).then(res => {
          if (res.data.success) {
            this.goodList = res.data.data.data;
            this.paginations.page_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        });
      },
      /**
       * 所有品牌
       */
      getData() {
        getBrand().then(res => {
          if (res.data.success)
            this.tableData = res.data.data;
        });
      },
      addBrand() {
        this.type = "add";
        this.brandListIsShow = false;
        this.addBrandIsShow = true;
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              name: this.ruleForm.name,
              item: this.ruleForm.item,
            };
            addBrand(params).then(res => {
              if (res.data.success) {
                this.getData();
                this.$message({
                  message: '添加品牌成功！',
                  type: 'success',
                  center: true
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      edit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              brand_id: this.ruleForm.id,
              name: this.ruleForm.name,
              item: this.ruleForm.item,
            };
            editBrand(params).then(res => {
              if (res.data.success) {
                this.getData();
                this.$message({
                  message: '添加品牌成功！',
                  type: 'success',
                  center: true
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      handleSelectionChange(val) {
        this.selGoodsName = "";
        this.ruleForm.item = "";
        this.selGoodsName = "";
        val.forEach((item, index) => {
          this.selGoodsName += item.goods_name + " ";
          this.ruleForm.item += item.goods_id + ",";
        });
        this.multipleSelection = val;
      },
      // 关闭添加按钮
      backBrandList() {
        this.brandListIsShow = true;
        this.addBrandIsShow = false;
        this.ruleForm = {
          id: "",
          name: "",
          item: [],//选择的商品ID
        }
      },
      delSingleBrand(id) {
        let _this = this;
        let params = {
          brand_id: id
        };
        delBrand(params).then(res => {
          if (res.data.success) {
            _this.getData()
          }
        })
      }
    }
  };
</script>
<style scoped lang="scss">
  .el-message-box__wrapper {
    height: 500px;
    overflow: auto;
    position: absolute;
    top: 50%;
    left: 50%;
  }
</style>
