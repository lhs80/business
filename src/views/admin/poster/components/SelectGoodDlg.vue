<template>
  <!--选择商品弹框-->
  <el-dialog :visible="show" title="数据选择器" :fullscreen="true">
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
      :row-key="getRowKey"
      ref="goodList"
      :data="goodList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true"/>
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
    <div slot="footer">
      <el-button type="primary" size="small" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getBrand, getGoodsList} from '@/api/activity'

  export default {
    props: ['show', 'selectList', 'catId'],
    data() {
      return {
        goodList: [],//所有商品列表
        paginations: {
          page_index: 1, // 当前位于哪页
          total: 0, // 总条数`
          page_count: 0,//总页数
          page_size: 5, // 1页显示多少条
          pageSizes: [5, 10, 15, 20], //每页显示多少条
          layout: 'total, sizes, prev, pager, next, jumper' // 翻页属性
        },
        searchKey: '',
        brandList: [],//所有品牌列表
        multipleSelection: []
      }
    },
    watch: {
      show(value) {
        if (value) {
          this.getAllGoods(true);
          this.getData();
        }
      }
    },
    methods: {
      /** * 所有品牌 */
      getData() {
        getBrand().then(res => {
          if (res.data.success)
            this.brandList = res.data.data;
        });
      },
      /** * 所有商品 */
      getAllGoods(init = false) {
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
            if (init) {
              this.toggleSelection(this.selectList)
            }
          }
        });
      },
      /** * 选择的商品 */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      close() {
        this.$emit('close', this.multipleSelection);
        this.$refs.goodList.clearSelection();
        this.paginations.page_index = 1;
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
            this.$refs.goodList.toggleRowSelection(row);
          });
        } else {
          this.$refs.goodList.clearSelection()
        }
      },
      getRowKey(row) {
        return row.goods_id
      },
    }
  }
</script>
