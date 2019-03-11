<template>
  <div class="app-container calendar-list-container client-list">
    <div v-if="commodityIsShow">
      <div class="client-set-option">
        <el-button type="primary" size="small" @click="addCommodityFun">添加商品</el-button>
        <el-input
          placeholder="商品内容"
          style="width:200px;height:32px !important;"
          v-model="searchKey"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" size="small" @click="getData">搜索</el-button>
      </div>

      <div class="chushou-btn mt2">
        <el-button type="primary" size="small" @click="delMulGoods">彻底删除</el-button>
        <el-button type="primary" size="small" @click="changeGoodStatus">恢复到仓库</el-button>
        <el-button type="primary" size="small">批量分类</el-button>
      </div>
      <div class="table_container">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          :data="tableData"
          stripe
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column sortable type="index" label="排序" width="120"></el-table-column>
          <!--<el-table-column sortable property="goods_id" label="排序" width="120" align="center"></el-table-column>-->
          <el-table-column property="logo" label="商品图片" width="120" align="center">
            <template slot-scope="scope">
              <img :src=scope.row.logo style="height:60px;"/>
            </template>
          </el-table-column>
          <el-table-column property="goods_name" label="商品名称" width="120" align="center"></el-table-column>
          <el-table-column property="price" label="价格" width="160" align="center"></el-table-column>
          <el-table-column property="reserve" label="库存" width="180" align="center"></el-table-column>
          <el-table-column property="sales" label="销量" width="180" align="center"></el-table-column>
          <el-table-column property="status" label="状态" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="primary">已删除</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <i class="el-icon-edit-outline" title="恢复" @click="changeSingleGoodStatus(scope.row.goods_id)"></i>
              <i class="el-icon-delete" title="删除" @click="delSingleGood(scope.row.goods_id)"></i>
            </template>
          </el-table-column>
        </el-table>

        <el-row class="mt2 pull-right">
          <el-col :span="24">
            <div class="pagination">
              <el-pagination
                v-if="paginations.total > 0"
                :page-sizes="paginations.page_sizes"
                :page-size="paginations.page_size"
                :layout="paginations.layout"
                :total="paginations.total"
                :current-page="paginations.page_index"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              ></el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <add-commodity v-if="addPageIsShow" @back="backCurrentPage"></add-commodity>
  </div>
</template>

<script>
  import addCommodity from "@/components/addCommodity";
  import {getGoodsList, setGoodsStatus, delGoods} from "@/api/activity";

  export default {
    name: "sellOut",
    components: {addCommodity},
    data: () => {
      return {
        searchKey: "",
        commodityIsShow: true,
        addPageIsShow: false,
        tableData: [],
        //需要给分页组件传的信息
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总数
          page_size: 20, // 1页显示多少条
          page_sizes: [5, 10, 15, 20], //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        }
      };
    },
    created() {
      this.getData();

    },
    methods: {
      getData() {
        let params = `?type=4&searchKey=${this.searchKey}&pageSize=${this.paginations.page_size}&pageIndex=${this.paginations.page_index}`;
        getGoodsList(params).then(res => {
          console.log(res)
          this.tableData = res.data.data.data;
          this.paginations.total = res.data.data.pageinfo.totalpage;
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
      //回到当前页
      backCurrentPage() {
        this.addPageIsShow = false;
        this.commodityIsShow = true;
      },
      getList({page, page_size, where, fun} = {}) {
        var query = this.$route.query;
        this.paginations.page_index = page || parseInt(query.page) || 1;
        this.paginations.page_size =
          page_size || parseInt(query.page_size) || this.paginations.page_size;
        var data = {
          pageIndex: this.paginations.page_index,
          pageSize: this.paginations.page_size
        };
        if (where) {
          data = Object.assign(data, where || {});
        }
        // 封装  get,path,params,fn,errfn
        axios({
          type: "get",
          path: "/api/user/getUserInfo",
          data: data,
          fn: data => {
            console.log(data);
            //成功之后的回调函数
            this.paginations.total = data.count;
            this.tableData = [];
            data.data.forEach((item, index) => {
              const tableItem = {
                id: item._id,
                sortnum: this.sortnum + (index + 1),
                username: item.username,
                address: item.address,
                createTime: mutils.parseToDate(JSON.stringify(item.createTime)),
                updateTime: mutils.parseToDate(JSON.stringify(item.updateTime)),
                ip: item.ip,
                area: item.area,
                region_id: item.region_id, //地区编号
                city_id: item.city_id, //城市编号
                isp: item.isp // 网络
              };
              this.tableData.push(tableItem);
            });
            fun && fun();
          }
        });
      },

      /**
       * 改变页码和当前页时需要拼装的路径方法
       * @param {string} field 参数字段名
       * @param {string} value 参数字段值
       */
      setPath(field, value) {
        var path = this.$route.path,
          query = Object.assign({}, this.$route.query);
        if (typeof field === "object") {
          query = field;
        } else {
          query[field] = value;
        }
        this.$router.push({
          path,
          query
        });
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        console.log(`每页 ${page_size} 条`);
        this.getData()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.paginations.page_index = page;
        this.getData();
      },
      //恢复到仓库
      changeGoodStatus() {
        let ids = "", _this = this;
        this.multipleSelection.forEach((item, index) => {
          ids += item.goods_id + ",";
        });
        let params = {
          goods_id: ids,
          status: 0
        };
        setGoodsStatus(params).then(res => {
          if (res.data.success) {
            _this.getData();
          }
        })

      },
      //恢复到仓库
      changeSingleGoodStatus(id) {
        let _this = this;
        let params = {
          goods_id: id,
          status: 0
        };
        setGoodsStatus(params).then(res => {
          if (res.data.success) {
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
          is_real: 1
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
          is_real: 1
        };
        delGoods(params).then(res => {
          if (res.data.success) {
            _this.getData();
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

  .client-filter {
    float: left;
    margin-left: 10px;
  }

  .chushou-btn {
    height: 55px;
  }
</style>
