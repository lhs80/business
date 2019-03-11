<template>
<!-- 待审核 -->
  <div class="app-container calendar-list-container client-list">
    <div v-if="commodityIsShow">
    <div class="client-set-option">
      <div class="client-filter">
        <el-input
          placeholder="商品内容"
          style="width:200px;height:32px !important;"
          v-model="searchKey"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>

    <div class="chushou-btn">
      <div class="client-edit-level">
        <el-button type="primary" size="small" @click="open3">下架</el-button>
      </div>
      <div class="client-edit-level">
        <el-button type="primary" size="small" @click="open3">彻底删除</el-button>
      </div>
      
    </div>
    <div class="table_container">
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
        height="250"
        style="width:100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column sortable property="id" label="排序" width="120" align="center"></el-table-column>
        <el-table-column property="shangImg" label="商品图片" width="120" align="center"></el-table-column>
        <el-table-column property="shangName" label="商品名称" width="120" align="center"></el-table-column>
        <el-table-column property="belong" label="所属" width="160" align="center"></el-table-column>
        <el-table-column property="plice" label="价格" width="160" align="center"></el-table-column>
        <el-table-column property="kecun" label="库存" width="180" align="center"></el-table-column>
        <el-table-column property="xiaoliang" label="销量" width="180" align="center"></el-table-column>
        <el-table-column property="state" label="状态" width="120" align="center"></el-table-column>
       
      </el-table>

      <el-row>
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
   
  </div>
</template>

<script>
// import addCommodity from "@/components/addCommodity";
export default {
  name: "onOnffer",
  data: () => {
    return {
      searchKey: "",
      commodityIsShow:true,
      addPageIsShow: false,
      tableData: [
        {
          id: 1,
          shangImg: "回电话",
          shangName: "小虎队",
          belong:"hgh==",
          plice: "152526353",
          kecun: "2018-12-22 15:46:44",
          xiaoliang: "5",
          state: "900.00"
        },
        {
          id: 2,
          shangImg: "回电话",
          shangName: "小虎队",
           belong:"hgh==",
          plice: "152526353",
          kecun: "2018-12-22 15:46:44",
          xiaoliang: "5",
          state: "900.00"
        },
        {
          id: 3,
          shangImg: "回电话",
          shangName: "小虎队",
           belong:"hgh==",
          plice: "152526353",
          kecun: "2018-12-22 15:46:44",
          xiaoliang: "5",
          state: "900.00"
        }
      ],
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
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
   
    getList({ page, page_size, where, fun } = {}) {
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
      this.getList({
        page_size,
        fun: () => {
          this.setPath("page_size", page_size);
        }
      });
    },
    // 上下分页
    handleCurrentChange(page) {
      this.sortnum = this.paginations.page_size * (page - 1);
      this.getList({
        page,
        fun: () => {
          this.setPath("page", page);
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
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