<template>
  <section class="app-container calendar-list-container client-list">
    <aside>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" size="small" @click="$router.push('/productadd/add')">添加商品</el-button>
          <el-button type="primary" size="small" @click="changeGoodStatus(0)"
                     v-if="$route.query.type===1||$route.query.type===2">下架
          </el-button>
          <el-button type="primary" size="small" @click="changeGoodStatus(1)" v-if="$route.query.type===3">上架
          </el-button>
          <el-button type="primary" size="small" @click="changeGoodStatus(0)" v-if="$route.query.type===4">恢复到仓库
          </el-button>
          <el-button type="primary" size="small" @click="delMulGoods">删除</el-button>
          <el-button type="primary" size="small" @click="wantToChangeType">批量分类</el-button>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-input
            placeholder="商品内容"
            style="width:200px;"
            v-model="searchKey"
            size="small"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button type="primary" size="small" @click="getData">搜索</el-button>
        </el-col>
      </el-row>
      <el-table
        class="mt2"
        ref="multipleTable"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column sortable type="index" label="排序" width="120"></el-table-column>
        <!--<el-table-column sortable property="goods_id" label="排序" width="120" align="center"></el-table-column>-->
        <el-table-column property="logo" label="商品">
          <template slot-scope="scope">
            <img :src=scope.row.logo style="height:60px;width:60px;vertical-align:middle"/>
            <span class="prl1">{{scope.row.goods_name}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column property="goods_name" label="商品名称" width="120" align="center"></el-table-column>-->
        <el-table-column property="price" label="价格" width="160" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">￥{{scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column property="reserve" label="库存" width="180" align="center"></el-table-column>
        <el-table-column property="sales" label="销量" width="180" align="center"></el-table-column>
        <el-table-column property="status" label="状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===1">上架</el-tag>
            <el-tag v-if="scope.row.status===2">已售空</el-tag>
            <el-tag type="danger" v-if="scope.row.status===3">已售空</el-tag>
            <el-tag type="danger" v-if="scope.row.status===-1">下架</el-tag>
            <el-tag class="mt1" type="warning"  v-if="scope.row.is_audit===0">审核中</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="$route.query.type!==4">
              <i class="el-icon-edit" @click="$router.push({path:'/productedit/edit',query:{id:scope.row.goods_id}})"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="恢复" placement="top" v-else>
              <i class="el-icon-refresh" @click="returnStatus(scope.row.goods_id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="$route.query.type!==4">
              <i class="el-icon-delete" @click="delSingleGood(scope.row.goods_id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-else>
              <i class="el-icon-delete" @click="realDelSingleGood(scope.row.goods_id)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
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
        class="mt2 pull-right"
      ></el-pagination>
    </aside>
    <!--修改分类弹框-->
    <aside tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper"
           style="z-index: 99;"
           v-show="isShowEditType">
      <div class="el-message-box el-message-box--center">
        <div class="bg-grey">
          <el-row class="prl2">
            <el-col :span="12" class="h5">批量修改商品分类</el-col>
            <el-col :span="12" class="text-right h4">
              <i class="el-message-box__close el-icon-close" @click="isShowEditType=false"></i>
            </el-col>
          </el-row>
        </div>
        <div class="el-message-box__content">
          <el-select v-model="changeStatue" placeholder="请选择">
            <el-option
              v-for="item in goodTypes"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_name"
            ></el-option>
          </el-select>
        </div>
        <div class="el-message-box__btns">
          <el-button type="primary" @click="batchSetGoodsCat">确认</el-button>
          <el-button type="primary" @click="isShowEditType=false">取消</el-button>
        </div>
      </div>
    </aside>
    <div class="v-modal" tabindex="0" style="z-index: 80;" v-if="isShowEditType"></div>
  </section>
</template>

<script>
  import {getGoodsList, setGoodsStatus, delGoods, getGoodsCat, batchSetGoodsCatFun} from "@/api/activity";

  export default {
    name: "onOnffer",
    data: () => {
      return {
        isShowEditType: false,
        searchKey: "",
        tableData: [],
        goodTypes: [],
        multipleSelection: "",
        changeStatue: "",
        //需要给分页组件传的信息
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 10, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        }
      };
    },
    created() {
      this.getData();
      this.getAllGoodsType();
    },
    watch: {
      "$route": "getData"
    },
    methods: {
      wantToChangeType() {
        if (this.multipleSelection.length)
          this.isShowEditType = true;
        else
          this.$message({
            showClose: true,
            message: "请先选择产品",
            type: "success"
          });
      },
      getData() {
        let params = {
          cat_id: this.catId,
          type: this.$route.query.type,
          searchKey: this.searchKey,
          pageSize: this.paginations.page_size,
          pageIndex: this.paginations.page_index,
        };
        getGoodsList(params).then(res => {
          console.log("goods", res);
          if (res.data.success) {
            this.tableData = res.data.data.data;
            this.paginations.page_count = res.data.data.pageinfo.totalpage;
            this.paginations.total = res.data.data.pageinfo.count;
          }
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //添加商品
      addCommodityFun() {
        this.commodityIsShow = false;
        this.addPageIsShow = true;
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.paginations.page_size = page_size;
        this.getData()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.getData();
      },
      /**
       * 所有分类
       */
      getAllGoodsType() {
        getGoodsCat().then(res => {
          if (res.data.success)
            this.goodTypes = res.data.data;
        });
      },
      //修改产品状态
      changeGoodStatus(status) {
        let ids = "", _this = this;
        this.multipleSelection.forEach((item, index) => {
          ids += item.goods_id + ",";
        });
        let params = {
          goods_id: ids,
          status: status
        };
        setGoodsStatus(params).then(res => {
          if (res.data.success) {
            _this.getData();
          }
        })
      },
      //恢复
      returnStatus(id) {
        let params = {
          goods_id: [id],
          status: 0
        };
        setGoodsStatus(params).then(res => {
          if (res.data.success) {
            this.getData();
          }
        })
      },
      delMulGoods() {
        let ids = "", _this = this;
        this.multipleSelection.forEach((item, index) => {
          ids += item.goods_id + ",";
        });
        let params = {
          goods_id: ids,
          is_real: 0
        };
        delGoods(params).then(res => {
          if (res.data.success) {
            _this.getData();
          }
        })
      },
      delSingleGood(id) {
        let _this = this;
        let params = {
          goods_id: id,
          is_real: 0
        };
        delGoods(params).then(res => {
          if (res.data.success) {
            _this.getData();
          }
        })
      },
      realDelSingleGood(id) {
        let _this = this;
        let params = {
          goods_id: id,
          is_real: 1
        };
        delGoods(params).then(res => {
          if (res.data.success) {
            _this.getData();
          }
        })
      },
      batchSetGoodsCat() {
        let goodIds = "";
        this.multipleSelection.forEach((item, index) => {
          goodIds += item.good_id + ","
        });
        let params = {
          goods_id: goodIds,
          cat_id: this.changeStatue
        };
        batchSetGoodsCatFun(params).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "批量修改分类成功",
              type: "success"
            });
            this.getData();
            this.isShowEditType = false;
          }
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .client-list {
    width: 100%;
    height: 100%;
  }

  .client-set-option {
    height: 55px;
  }

  .client-edit-level {
    float: left;
    width: 100px;
  }

  .client-filter {
    float: left;
    margin-left: 10px;
  }

  .chushou-btn {
    height: 55px;
  }
</style>
