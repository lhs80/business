<template>
  <section class="app-container calendar-list-container client-list">
    <aside>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" size="small" @click="changeGoodStatus(0)" v-if="$route.query.type===1">下架</el-button>
          <el-button type="primary" size="small" @click="passCheck()" v-if="$route.query.type===5">批量审核通过</el-button>
          <el-button type="primary" size="small" @click="delMulGoods">彻底删除</el-button>
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
        style="width:100%"
        class="mt2"
        ref="multipleTable"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column sortable type="index" label="排序" width="50" align="center"></el-table-column>
        <el-table-column property="logo" label="商品" width="200">
          <template slot-scope="scope">
            <el-row type="flex" align="middle">
              <el-col :span="12"><img :src=scope.row.logo style="height:60px;width:60px"/></el-col>
              <el-col :span="12"><span>{{scope.row.goods_name}}</span></el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column property="m_name" label="所属" align="center"></el-table-column>
        <el-table-column property="price" label="价格" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">￥{{scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column property="reserve" label="库存" align="center"></el-table-column>
        <el-table-column property="sales" label="销量" align="center"></el-table-column>
        <el-table-column property="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="$route.query.type===1">已上架</el-tag>
            <el-tag v-if="$route.query.type===5">审核中</el-tag>
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
  </section>
</template>

<script>
  import {adminGoodListFun, updateGoodStatus, delGoodsFun} from "@/api/activity";

  export default {
    name: "onOnffer",
    data: () => {
      return {
        isShowEditType: false,
        searchKey: "",
        tableData: [],
        multipleSelection: "",
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
          type: this.$route.query.type,
          searchKey: this.searchKey,
          pageSize: this.paginations.page_size,
          pageIndex: this.paginations.page_index,
        };
        adminGoodListFun(params).then(res => {
          console.log("goods",res)
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
      //下架
      changeGoodStatus(status) {
        let ids = "", _this = this;
        this.multipleSelection.forEach((item, index) => {
          ids += item.goods_id + ",";
        });
        let params = {
          goods_id: ids,
          status: status
        };
        updateGoodStatus(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            _this.getData();
          }
        })
      },
      //通过审核
      passCheck() {
        let ids = "", _this = this;
        this.multipleSelection.forEach((item, index) => {
          ids += item.goods_id + ",";
        });
        let params = {
          goods_id: ids,
          is_audit: 1
        };
        updateGoodStatus(params).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            _this.getData();
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
        delGoodsFun(params).then(res => {
          if (res.data.success) {
            _this.getData();
          }
        })
      },
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
